'use client'

/**
 * ExportButton Component
 *
 * Professional data export functionality (CSV and PDF)
 * Includes LodgeIQ branding, applied filters, and formatted tables
 */

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface ExportColumn {
  key: string
  label: string
  format?: (value: any) => string
}

export interface ExportButtonProps {
  data: any[]
  columns: ExportColumn[]
  filename: string
  title: string
  filters?: Record<string, any>
}

export function ExportButton({ data, columns, filename, title, filters }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)
    try {
      // Create CSV header
      const header = columns.map((col) => col.label).join(',')

      // Create CSV rows
      const rows = data.map((row) =>
        columns
          .map((col) => {
            const value = col.format ? col.format(row[col.key]) : row[col.key]
            // Escape special characters for CSV
            const escaped = String(value || '').replace(/"/g, '""')
            return `"${escaped}"`
          })
          .join(',')
      )

      // Combine header and rows
      const csv = [header, ...rows].join('\n')

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${filename}.csv`
      link.click()
      URL.revokeObjectURL(link.href)

      toast.success('CSV exported successfully')
    } catch (error) {
      console.error('CSV export error:', error)
      toast.error('Failed to export CSV')
    } finally {
      setIsExporting(false)
      setShowMenu(false)
    }
  }

  const exportToPDF = () => {
    setIsExporting(true)
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Add header with LodgeIQ branding
      doc.setFillColor(99, 102, 241) // Indigo-500
      doc.rect(0, 0, pageWidth, 25, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('LodgeIQ', 14, 12)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Property Inspection & Compliance', 14, 18)

      // Add title
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 14, 35)

      // Add generation date
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      doc.text(`Generated: ${date}`, 14, 42)

      // Add applied filters if any
      let yPosition = 48
      if (filters && Object.keys(filters).length > 0) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Applied Filters:', 14, yPosition)
        yPosition += 5

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)

        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '' && (!Array.isArray(value) || value.length > 0)) {
            const filterText = `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
            doc.text(filterText, 18, yPosition)
            yPosition += 4
          }
        })
        yPosition += 3
      }

      // Prepare table data
      const tableColumns = columns.map((col) => col.label)
      const tableRows = data.map((row) =>
        columns.map((col) => {
          const value = col.format ? col.format(row[col.key]) : row[col.key]
          return String(value || '')
        })
      )

      // Add table with autoTable
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: yPosition,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [99, 102, 241], // Indigo-500
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'left',
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // Light gray
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          // Add footer with page numbers
          const pageCount = (doc as any).internal.getNumberOfPages()
          doc.setFontSize(8)
          doc.setTextColor(100, 100, 100)
          const pageText = `Page ${(doc as any).internal.getCurrentPageInfo().pageNumber} of ${pageCount}`
          doc.text(pageText, pageWidth / 2, pageHeight - 10, { align: 'center' })

          // Add LodgeIQ watermark in footer
          doc.setFontSize(7)
          doc.text('Generated by LodgeIQ | lodge-iq.vercel.app', pageWidth - 14, pageHeight - 10, {
            align: 'right',
          })
        },
      })

      // Save PDF
      doc.save(`${filename}.pdf`)

      toast.success('PDF exported successfully')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF')
    } finally {
      setIsExporting(false)
      setShowMenu(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting || data.length === 0}
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export
      </button>

      {/* Dropdown Menu */}
      {showMenu && !isExporting && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={exportToCSV}
              className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <div>
                <div className="font-medium">Export as CSV</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  For spreadsheet analysis
                </div>
              </div>
            </button>

            <button
              onClick={exportToPDF}
              className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-t border-neutral-200 dark:border-neutral-700"
            >
              <FileText className="w-4 h-4 text-red-600 dark:text-red-500" />
              <div>
                <div className="font-medium">Export as PDF</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Professional report
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
