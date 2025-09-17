import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

export const PdfIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
  >
    <path fill="#FF5722" d="M40 45L8 45 8 3 30 3 40 13z" />
    <path fill="#FBE9E7" d="M38.5 14L29 14 29 4.5z" />
    <path fill="#FFEBEE" d="M15.81 29.5V33H13.8v-9.953h3.391c.984 0 1.77.306 2.355.916s.878 1.403.878 2.379-.29 1.745-.868 2.311S18.175 29.5 17.149 29.5H15.81zM15.81 27.825h1.381c.383 0 .679-.125.889-.376s.314-.615.314-1.094c0-.497-.107-.892-.321-1.187-.214-.293-.501-.442-.861-.447H15.81V27.825zM21.764 33v-9.953h2.632c1.162 0 2.089.369 2.778 1.107.691.738 1.043 1.75 1.057 3.035v1.613c0 1.308-.346 2.335-1.035 3.079C26.504 32.628 25.553 33 24.341 33H21.764zM23.773 24.722v6.61h.602c.67 0 1.142-.177 1.415-.53.273-.353.417-.962.431-1.828v-1.729c0-.93-.13-1.578-.39-1.944-.26-.367-.702-.56-1.326-.578H23.773zM34.807 28.939h-3.124V33h-2.01v-9.953h5.51v1.675h-3.5v2.55h3.124V28.939z" />
  </svg>
)

export const ExcelIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
  >
    <path fill="#388E3C" d="M40 45L8 45 8 3 30 3 40 13z" />
    <path fill="#E8F5E9" d="M38.5 14L29 14 29 4.5z" />
    <path fill="#FFF" d="M23.739,26.457l2.092-4.254h3.524l-3.577,6.346L29.452,35h-3.56l-2.153-4.333L21.586,35h-3.551l3.665-6.451l-3.568-6.346h3.516L23.739,26.457z" />
  </svg>
)

export const PowerPointIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
  >
    <path fill="#FF6D00" d="M40 45L8 45 8 3 30 3 40 13z" />
    <path fill="#FFF3E0" d="M38.5 14L29 14 29 4.5z" />
    <path fill="#FFF" d="M23.4,29.5V33h-2V23h3.4c1,0,1.8,0.3,2.4,0.9c0.6,0.6,0.9,1.4,0.9,2.4c0,1-0.3,1.7-0.9,2.3c-0.6,0.6-1.4,0.8-2.4,0.8H23.4z M23.4,27.8h1.4c0.4,0,0.7-0.1,0.9-0.4c0.2-0.3,0.3-0.6,0.3-1.1c0-0.5-0.1-0.9-0.3-1.2c-0.2-0.3-0.5-0.4-0.9-0.4h-1.4V27.8z M15,29.5V33h-2V23h3.4c1,0,1.8,0.3,2.4,0.9c0.6,0.6,0.9,1.4,0.9,2.4s-0.3,1.7-0.9,2.3c-0.6,0.6-1.4,0.8-2.4,0.8H15z M15,27.8h1.4c0.4,0,0.7-0.1,0.9-0.4c0.2-0.3,0.3-0.6,0.3-1.1c0-0.5-0.1-0.9-0.3-1.2c-0.2-0.3-0.5-0.4-0.9-0.4H15V27.8z M36,24.7h-2.5V33h-2v-8.3h-2.4V23H36V24.7z" />
  </svg>
)

export const InvestorUpdateIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
  >
    <path fill="#FF5722" d="M32,15v28H10c-2.2,0-4-1.8-4-4V15H32z"></path>
    <path fill="#FFCCBC" d="M14,5v34c0,2.2-1.8,4-4,4h29c2.2,0,4-1.8,4-4V5H14z"></path>
    <path fill="#FF5722" d="M20 10H38V14H20zM20 17H28V19H20zM30 17H38V19H30zM20 21H28V23H20zM30 21H38V23H30zM20 25H28V27H20zM30 25H38V27H30zM20 29H28V31H20zM30 29H38V31H30zM20 33H28V35H20zM30 33H38V35H30zM20 37H28V39H20zM30 37H38V39H30z"></path>
  </svg>
)

export const DatabaseIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
  >
    <path fill="#D1C4E9" d="M38 7H10C8.9 7 8 7.9 8 9v6c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2V9C40 7.9 39.1 7 38 7zM38 19H10c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2v-6C40 19.9 39.1 19 38 19zM38 31H10c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2v-6C40 31.9 39.1 31 38 31z"></path>
  </svg>
)

export const ERPSystemIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
  >
    <path fill="#FFC107" d="M14,41H7V10h7V41z M32,22h-7v19h7V22z"></path>
    <path fill="#FF5722" d="M23,41h-7V6h7V41z M41,18h-7v23h7V18z"></path>
    <path fill="#CFD8DC" d="M5 40H43V42H5z"></path>
  </svg>
)

export const FolderIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
  >
    <path fill="#FFA000" d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z"></path>
    <path fill="#FFCA28" d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z"></path>
  </svg>
)

export const UploadIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
  >
    <path fill="#b3e5fc" d="M12 17A10 10 0 1 0 12 37A10 10 0 1 0 12 17Z"></path>
    <path fill="#b3e5fc" d="M24 9A12 12 0 1 0 24 33A12 12 0 1 0 24 9Z"></path>
    <path fill="#b3e5fc" d="M37.5 20A8.5 8.5 0 1 0 37.5 37A8.5 8.5 0 1 0 37.5 20Z"></path>
    <path fill="#b3e5fc" d="M12 27H37V37H12z"></path>
    <path fill="#3f51b5" d="M22 22H26V32H22z"></path>
    <path fill="#3f51b5" d="M24 17L18 24 30 24z"></path>
  </svg>
)

// Helper function to get the right icon based on mime type or file extension
export const getDocumentIcon = (mimeType?: string, fileName?: string, className?: string, size?: number) => {
  const extension = fileName?.split('.').pop()?.toLowerCase()

  if (mimeType?.includes('pdf') || extension === 'pdf') {
    return <PdfIcon className={className} size={size} />
  }

  if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel') ||
      extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
    return <ExcelIcon className={className} size={size} />
  }

  if (mimeType?.includes('presentation') || mimeType?.includes('powerpoint') ||
      extension === 'pptx' || extension === 'ppt') {
    return <PowerPointIcon className={className} size={size} />
  }

  // Default to PDF icon for unknown types
  return <PdfIcon className={className} size={size} />
}