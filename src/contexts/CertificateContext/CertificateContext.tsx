import React, {
  useState,
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from 'react'
import * as xlsx from 'xlsx'
import type { DraggingType, Position } from './types'
import { captureComponentAsPdf } from './helpers'

type CertificateContextType = {
  generatedNames: string[]
  template: string | null
  position: Position
  qrPosition: Position
  qrCode: string
  generated: boolean
  componentRefs: React.RefObject<Array<HTMLDivElement | null>>
  uploadTemplateFile: (file: File) => void
  uploadExcelFile: (file: File) => void
  downloadSingle: (index: number) => Promise<void>
  downloadAll: () => Promise<void>
  stop: (type: DraggingType, data: Position, id?: string) => void
  changeQrcode: (qr: string) => void
  changeGenerated: (generated: boolean) => void
  reset: () => void
}

const CertificateContext = createContext<CertificateContextType | undefined>(
  undefined
)

type Props = {
  children: ReactNode
}

export const CertificateProvider = ({ children }: Props) => {
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [template, setTemplate] = useState<string | null>(null)
  const [position, setPosition] = useState<Position>({ x: 130, y: 400 })
  const [qrPosition, setQrPosition] = useState<Position>({ x: 1050, y: 100 })
  const [qrCode, setQrcode] = useState<string>('')
  const [generated, setGenerated] = useState(false)

  const componentRefs = useRef<Array<HTMLDivElement | null>>([])

  const handleDownloadSingle = async (i: number) => {
    const ref = componentRefs.current[i]

    if (!ref) {
      return
    }

    try {
      const pdf = await captureComponentAsPdf(ref)
      pdf.save(`certificate-${generatedNames[i] || i + 1}.pdf`)
    } catch (error) {
      console.error('Error capturing certificate as PDF:', error)
    }
  }

  const handleDownloadAll = async () => {
    for (let i = 0; i < componentRefs.current.length; i++) {
      const ref = componentRefs.current[i]

      if (ref) {
        try {
          const pdf = await captureComponentAsPdf(ref)
          pdf.save(`certificate-${generatedNames[i] || i + 1}.pdf`)
        } catch (error) {
          console.error('Error capturing certificate as PDF:', error)
        }
      }
    }
  }

  const handleUploadTemplate = (file: File) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      setTemplate(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadExcel = (file: File) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target?.result
      if (!data) {
        return
      }

      const workbook = xlsx.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const rows: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 })
      const names = rows.map((row) => row[0]).filter((name) => !!name)
      setGeneratedNames(names as string[])
    }
    reader.readAsBinaryString(file)
  }

  const handleStop = (type: DraggingType, data: Position) => {
    const newPosition = { x: data.x, y: data.y }

    switch (type) {
      case 'name':
        setPosition(newPosition)
        break
      case 'qr':
        setQrPosition(newPosition)
        break
      default:
        break
    }
  }

  const handleReset = () => {
    setGeneratedNames([])
    setTemplate(null)
    setQrcode('')
    setGenerated(false)
    componentRefs.current = []
  }

  const value = {
    generatedNames,
    template,
    position,
    qrPosition,
    qrCode,
    generated,
    componentRefs,
    uploadTemplateFile: handleUploadTemplate,
    uploadExcelFile: handleUploadExcel,
    downloadSingle: handleDownloadSingle,
    downloadAll: handleDownloadAll,
    stop: handleStop,
    changeQrcode: setQrcode,
    changeGenerated: setGenerated,
    reset: handleReset,
  }

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  )
}

export const useCertificateContext = (): CertificateContextType => {
  const context = useContext(CertificateContext)

  if (!context) {
    throw new Error(
      'useCertificateContext must be used within a CertificateProvider!'
    )
  }

  return context
}
