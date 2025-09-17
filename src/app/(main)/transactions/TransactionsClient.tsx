"use client"
import { DocumentCard } from "@/components/ui/transactions/DocumentCard"
import React from "react"

interface Document {
  id: string
  name: string
  category: string
  fileName?: string | null
  mimeType?: string | null
  uploadDate: Date
  size: number
  status: string
  reviewer?: {
    name: string
  } | null
}

interface TransactionsClientProps {
  documents: Document[] | null | undefined
}

export function TransactionsClient({ documents }: TransactionsClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [isLoading, setIsLoading] = React.useState(false)
  const documentArray = Array.isArray(documents) ? documents : []
  const [displayedDocuments, setDisplayedDocuments] = React.useState(documentArray)

  const handleCategoryChange = async (categoryId: string) => {
    if (categoryId === selectedCategory) return

    // Immediately show skeleton
    setIsLoading(true)

    // Simulate processing delay for better UX feedback
    await new Promise(resolve => setTimeout(resolve, 800))

    // Update the category and filtered documents
    setSelectedCategory(categoryId)
    const filteredDocs = categoryId === "all"
      ? documentArray
      : documentArray.filter(d => d.category === categoryId)
    setDisplayedDocuments(filteredDocs)

    setIsLoading(false)
  }

  const categories = [
    { id: "all", label: "All Documents", count: documentArray.length },
    { id: "financial", label: "Financial", count: documentArray.filter(d => d.category === "financial").length },
    { id: "legal", label: "Legal", count: documentArray.filter(d => d.category === "legal").length },
    { id: "operational", label: "Operational", count: documentArray.filter(d => d.category === "operational").length },
    { id: "commercial", label: "Commercial", count: documentArray.filter(d => d.category === "commercial").length },
  ]

  // Transform documents to match the expected interface
  const transformedDocuments = displayedDocuments.map(doc => ({
    id: doc.id,
    name: doc.name,
    category: doc.category as 'financial' | 'legal' | 'operational' | 'commercial',
    fileName: doc.fileName,
    mimeType: doc.mimeType,
    uploadDate: doc.uploadDate,
    size: doc.size,
    status: doc.status as 'pending' | 'reviewed' | 'approved',
    reviewer: doc.reviewer,
  }))

  return (
    <div className="mt-6">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedCategory === category.id
                ? "border-elevia-sapphire text-elevia-sapphire dark:border-elevia-azure dark:text-elevia-azure"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            {category.label}
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded dark:bg-gray-800 animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded dark:bg-gray-800 animate-pulse w-2/3" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="h-6 w-16 bg-gray-200 rounded-full dark:bg-gray-800 animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded dark:bg-gray-800 animate-pulse" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 h-8 bg-gray-200 rounded dark:bg-gray-800 animate-pulse" />
                <div className="flex-1 h-8 bg-gray-200 rounded dark:bg-gray-800 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {transformedDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  )
}