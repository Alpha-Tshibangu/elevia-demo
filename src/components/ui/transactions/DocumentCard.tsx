// Using the database type instead of mock data type
interface TransactionDocument {
  id: string
  name: string
  category: string
  fileName?: string | null
  mimeType?: string | null
  size: number
  status: string
  reviewer?: { name: string } | null
}
import { cx } from "@/lib/utils"
import {
  RiDownloadLine,
  RiMoreLine,
  RiCheckLine,
  RiTimeLine,
  RiEyeLine
} from "@remixicon/react"
import { getDocumentIcon } from "@/components/icons/DocumentIcons"

interface DocumentCardProps {
  document: TransactionDocument
}

export function DocumentCard({ document }: DocumentCardProps) {
  const getStaticUploadTime = (docId: string) => {
    const staticTimes = {
      '1': '6 days ago',
      '2': '3 days ago', 
      '3': '1 day ago',
      '4': 'today'
    }
    return staticTimes[docId as keyof typeof staticTimes] || '1 week ago'
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-transparent border border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
      case "reviewed":
        return "bg-transparent border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400"
      case "pending":
        return "bg-transparent border border-amber-700 text-amber-700 dark:border-amber-400 dark:text-amber-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <RiCheckLine className="size-3" />
      case "reviewed":
        return <RiEyeLine className="size-3" />
      case "pending":
        return <RiTimeLine className="size-3" />
    }
  }


  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {getDocumentIcon(document.mimeType || undefined, document.fileName || undefined, "", 32)}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50 line-clamp-1">
              {document.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(document.size)} • {getStaticUploadTime(document.id)}
            </p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <RiMoreLine className="size-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={cx(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            getStatusColor(document.status),
          )}
        >
          {getStatusIcon(document.status)}
          {document.status}
        </span>
        
        {document.reviewer && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            by {document.reviewer.name}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          <RiEyeLine className="size-3.5" />
          View
        </button>
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          <RiDownloadLine className="size-3.5" />
          Download
        </button>
      </div>
    </div>
  )
}