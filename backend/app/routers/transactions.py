from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List

from app.core.database import get_db
from app.models.organization import Organization
from app.models.transaction import Transaction, TransactionDocument, DueDiligenceTask
from app.schemas.transaction import TransactionResponse, DueDiligenceProgress

router = APIRouter()


@router.get("/", response_model=Optional[TransactionResponse])
async def get_transaction(db: Session = Depends(get_db)):
    """Get transaction with all related data"""

    # Get the organization
    org = db.query(Organization).first()
    if not org:
        return None

    # Get transaction with documents and tasks
    transaction = db.query(Transaction)\
        .filter(Transaction.organization_id == org.id)\
        .options(
            joinedload(Transaction.documents).joinedload(TransactionDocument.reviewer),
            joinedload(Transaction.due_diligence_tasks).joinedload(DueDiligenceTask.assignee)
        )\
        .first()

    if not transaction:
        return None

    # Convert to response format
    converted_documents = []
    for doc in sorted(transaction.documents, key=lambda x: x.upload_date, reverse=True):
        converted_documents.append({
            'id': doc.id,
            'name': doc.name,
            'category': doc.category,
            'fileName': doc.file_name,
            'mimeType': doc.mime_type,
            'size': doc.size,
            'status': doc.status,
            'uploadDate': doc.upload_date,
            'reviewer': {
                'id': doc.reviewer.id,
                'name': doc.reviewer.name,
                'email': doc.reviewer.email
            } if doc.reviewer else None
        })

    converted_tasks = []
    for task in sorted(transaction.due_diligence_tasks, key=lambda x: x.created_at, reverse=True):
        converted_tasks.append({
            'id': task.id,
            'task': task.task,
            'description': task.description,
            'status': task.status,
            'priority': task.priority,
            'dueDate': task.due_date,
            'completedAt': task.completed_at,
            'createdAt': task.created_at,
            'assignee': {
                'id': task.assignee.id,
                'name': task.assignee.name,
                'email': task.assignee.email
            } if task.assignee else None
        })

    return TransactionResponse(
        id=transaction.id,
        name=transaction.name,
        description=transaction.description,
        valuation=float(transaction.valuation) if transaction.valuation else None,
        multiple=transaction.multiple,
        irr=float(transaction.irr) if transaction.irr else None,
        paybackYears=float(transaction.payback_years) if transaction.payback_years else None,
        status=transaction.status,
        photoUrl=transaction.photo_url,
        documents=converted_documents,
        dueDiligenceTasks=converted_tasks
    )


@router.get("/due-diligence", response_model=Optional[DueDiligenceProgress])
async def get_due_diligence_progress(db: Session = Depends(get_db)):
    """Get due diligence progress summary"""

    transaction = await get_transaction(db)
    if not transaction:
        return None

    tasks = transaction.due_diligence_tasks
    completed = len([t for t in tasks if t['status'] == 'completed'])
    in_progress = len([t for t in tasks if t['status'] == 'in-progress'])
    pending = len([t for t in tasks if t['status'] == 'pending'])
    blocked = len([t for t in tasks if t['status'] == 'blocked'])

    summary = {
        'total': len(tasks),
        'completed': completed,
        'inProgress': in_progress,
        'pending': pending,
        'blocked': blocked,
        'completionRate': (completed / len(tasks)) * 100 if tasks else 0
    }

    return DueDiligenceProgress(
        tasks=tasks,
        summary=summary
    )