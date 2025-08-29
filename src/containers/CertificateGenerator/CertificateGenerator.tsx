import React, { useRef, useState } from 'react'
import domtoimage from 'dom-to-image-more'
import type { DraggingType, ExtraText, Position } from './types'
import { CertificatePreview } from './components/CertificatePreview'
import { Box, Loader } from '../../components'
import {
  FaDownload,
  FaFileImage,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUsers,
} from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import * as xlsx from 'xlsx'

export const CertificateGenerator = () => {
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [template, setTemplate] = useState<string | null>(null)
  const [position, setPosition] = useState<Position>({ x: 130, y: 400 })
  const [qrPosition, setQrPosition] = useState<Position>({ x: 1050, y: 100 })
  // TODO: Implement change size of QR code
  // const [qrSize, setQrSize] = useState<number>(100)
  const [input, setInput] = useState<string>('')
  const [qrCode, setQrcode] = useState<string>('')
  const [extraTexts, setExtraTexts] = useState<ExtraText[]>([])
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [dnd, setDnd] = useState(false)
  const [excelFileName, setExcelFileName] = useState<string | null>(null)
  const [generated, setGenerated] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  // const [loading, setLoading] = useState(false)

  const componentRefs = useRef<Array<HTMLDivElement | null>>([])
  const generatorRef = useRef<HTMLDivElement | null>(null) // 🔑 ref do generatora

  const handleDownloadSingle = async (i: number) => {
    setActiveIndex(null)

    const ref = componentRefs.current[i]
    if (!ref) return

    try {
      const pxToMm = (px: number) => px / 3.78
      const imgWidthPx = ref.offsetWidth
      const imgHeightPx = ref.offsetHeight
      const imgWidthMm = pxToMm(imgWidthPx)
      const imgHeightMm = pxToMm(imgHeightPx)
      const pageWidthMm = 297
      const pageHeightMm = 210
      const scale = Math.min(
        pageWidthMm / imgWidthMm,
        pageHeightMm / imgHeightMm,
        1
      )
      const renderWidthMm = imgWidthMm * scale
      const renderHeightMm = imgHeightMm * scale
      const xMm = (pageWidthMm - renderWidthMm) / 2
      const yMm = (pageHeightMm - renderHeightMm) / 2
      const dataUrl = await domtoimage.toPng(ref)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [pageWidthMm, pageHeightMm],
      })
      pdf.addImage(dataUrl, 'PNG', xMm, yMm, renderWidthMm, renderHeightMm)
      pdf.save(`certificate-${i + 1}.pdf`)
    } catch (error) {
      console.error('Error capturing certificate as PDF:', error)
    }
  }

  const handleDownloadAll = async () => {
    setActiveIndex(null)

    // Upewnij się, że masz zainstalowaną bibliotekę jspdf: npm install jspdf
    // @ts-ignore

    for (let i = 0; i < componentRefs.current.length; i++) {
      const ref = componentRefs.current[i]

      if (ref) {
        try {
          // Przelicz piksele na milimetry (przyjmując 96 DPI: 1mm ≈ 3.78px)
          const pxToMm = (px: number) => px / 3.78
          const imgWidthPx = ref.offsetWidth
          const imgHeightPx = ref.offsetHeight
          const imgWidthMm = pxToMm(imgWidthPx)
          const imgHeightMm = pxToMm(imgHeightPx)
          // Ustal rozmiar strony PDF (A4 landscape: 297x210 mm)
          const pageWidthMm = 297
          const pageHeightMm = 210
          // Oblicz skalę, aby obrazek zmieścił się na stronie, zachowując proporcje
          const scale = Math.min(
            pageWidthMm / imgWidthMm,
            pageHeightMm / imgHeightMm,
            1
          )
          const renderWidthMm = imgWidthMm * scale
          const renderHeightMm = imgHeightMm * scale
          // Wyśrodkuj obrazek na stronie
          const xMm = (pageWidthMm - renderWidthMm) / 2
          const yMm = (pageHeightMm - renderHeightMm) / 2
          const dataUrl = await domtoimage.toPng(ref)
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [pageWidthMm, pageHeightMm],
          })
          pdf.addImage(dataUrl, 'PNG', xMm, yMm, renderWidthMm, renderHeightMm)
          pdf.save(`certificate-${i + 1}.pdf`)
        } catch (error) {
          console.error('Error capturing certificate as PDF:', error)
        }
      }
    }
  }

  function handleUploadTemplate(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const reader = new FileReader()
    if (file) {
      setSelectedFileName(file.name)
      reader.onloadend = () => {
        setTemplate(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleStop(type: DraggingType, data: Position, id?: string) {
    const newPosition = { x: data.x, y: data.y }

    switch (type) {
      case 'name':
        setPosition(newPosition)
        break
      case 'qr':
        setQrPosition(newPosition)
        break
      case 'extraTexts':
        setExtraTexts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, position: newPosition } : t))
        )
        break
      default:
        break
    }
  }

  function handleGenerateQrCode() {
    setQrcode(input)
  }

  function handleUploadExcel(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setExcelFileName(file.name)

    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = evt.target?.result
      if (!data) return

      const workbook = xlsx.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0] // bierzemy pierwszą zakładkę
      const sheet = workbook.Sheets[sheetName]
      const rows: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 }) // tablica tablic

      // Zakładamy, że w pierwszej kolumnie są imiona
      const names = rows.map((row) => row[0]).filter((name) => !!name)

      setGeneratedNames(names as string[])
    }

    reader.readAsBinaryString(file)
  }

  const handleDndOn = () => {
    setDnd((v) => !v)
    setActiveIndex(null)
  }

  // if (loading) {
  //   return <Loader />
  // }

  if (generated) {
    return (
      <section className='flex flex-col h-screen overflow-y-auto'>
        {/* Pasek górny */}
        <div className='sticky top-0 left-0 right-0 z-50 w-full bg-white shadow-md border-b border-gray-200'>
          <div className='flex items-center justify-between px-6 py-3'>
            {/* Drag & Drop switch */}
            <div className='gap-2 flex items-center'>
              <label className='flex items-center space-x-2 select-none'>
                <span
                  className={`font-medium ${!template ? 'opacity-50' : ''}`}
                >
                  Move all
                </span>
                <button
                  type='button'
                  role='switch'
                  disabled={!template}
                  aria-checked={dnd}
                  onClick={handleDndOn}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    dnd ? 'bg-orange-500' : 'bg-gray-300'
                  } ${!template ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      dnd ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <div className='h-8 w-[0.1rem] rounded-2xl bg-gray-300' />

              <div className='flex items-center gap-2'>
                <input
                  id='qr-input'
                  type='url'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className='px-4 py-1 border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors w-64'
                  placeholder='Enter info for QR code...'
                />
                <button
                  disabled={!input}
                  type='button'
                  className={`px-4 py-1 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition-colors font-semibold ${
                    !input ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleGenerateQrCode}
                >
                  Generate QR
                </button>
              </div>
            </div>

            {/* Pobierz wszystkie */}
            <button
              type='button'
              onClick={handleDownloadAll}
              disabled={!generatedNames.length}
              className={`relative flex items-center gap-2 font-medium text-orange-500 transition group
                ${
                  !generatedNames.length
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:text-orange-600'
                }
              `}
            >
              <span className='relative cursor-pointer'>
                Pobierz wszystkie
                <span className='absolute left-1/2 -bottom-0.5 w-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0' />
              </span>
            </button>
          </div>
        </div>

        {/* Kontent z podglądami */}
        <Box className='flex flex-col justify-between gap-6 my-4'>
          {generatedNames.map((name, index) => (
            <CertificatePreview
              key={index}
              name={name}
              template={template}
              position={position}
              qrPosition={qrPosition}
              onStop={handleStop}
              dnd={dnd}
              qrSize={80}
              qr={qrCode}
              innerRef={(el) => (componentRefs.current[index] = el)}
              extraTexts={extraTexts}
              onDownload={() => handleDownloadSingle(index)}
              active={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </Box>
      </section>
    )
  }

  return (
    <section className='flex flex-col items-center justify-center text-center h-full'>
      <h1 className='text-5xl font-bold text-gray-800 mb-8'>
        Certificate Generator 🎓
      </h1>
      <p className='text-gray-600 max-w-xl mx-auto mb-6'>
        Stwórz i pobierz swoje spersonalizowane certyfikaty w kilka minut! Wgraj
        listę uczestników z pliku Excel lub dodaj ręcznie, wybierz szablon,
        ustaw pozycję tekstu i QR-kodu, a następnie pobierz gotowe pliki PDF
        jednym kliknięciem.
      </p>
      <img
        src='https://cdn-icons-png.flaticon.com/512/3135/3135755.png'
        alt='Certificate illustration'
        className='w-32 h-32 mx-auto mb-8 opacity-90'
      />

      <div className='w-full max-w-md mx-auto border-2 border-dashed border-orange-400 rounded-xl overflow-hidden bg-orange-50'>
        <div className='h-1/2 flex flex-col items-center justify-center p-4 gap-2 border-b border-dashed border-gray-300 bg-white transition-shadow hover:bg-orange-100 cursor-pointer'>
          <input
            id='template-upload'
            type='file'
            accept='image/*'
            onChange={handleUploadTemplate}
            className='hidden'
          />
          <label
            htmlFor='template-upload'
            className='flex flex-col items-center justify-center w-full h-full cursor-pointer'
          >
            <div className='text-4xl mb-2 text-orange-400'>
              <FaFileImage />
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {selectedFileName ? selectedFileName : 'Wybierz szablon'}
            </span>
            {!selectedFileName && (
              <span className='text-xs text-gray-400'>
                (*.png, *.jpg, *.jpeg, *.gif, *.bmp, *.webp, *.svg)
              </span>
            )}
          </label>
        </div>

        <div
          className={`h-1/2 flex flex-col items-center justify-center p-4 gap-2 transition-shadow
      ${
        template
          ? 'bg-white hover:bg-orange-100 cursor-pointer'
          : 'bg-gray-100 opacity-50 cursor-not-allowed'
      }
    `}
        >
          <input
            id='excel-upload'
            type='file'
            accept='.xlsx, .xls'
            onChange={handleUploadExcel}
            className='hidden'
            disabled={!template}
          />
          <label
            htmlFor='excel-upload'
            className={`flex flex-col items-center justify-center w-full h-full ${
              template ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
          >
            <div className='text-4xl mb-2 text-green-400'>
              <FaUsers />
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {excelFileName ? excelFileName : 'Dodaj osoby'}
            </span>
            {!excelFileName && (
              <span className='text-xs text-gray-400'>(*.xlsx)</span>
            )}
          </label>
        </div>
      </div>

      <button
        className={`w-full max-w-md mx-auto mt-8 px-6 py-3 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition font-bold text-lg ${
          !template || !excelFileName
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        }`}
        onClick={() => setGenerated(true)}
        disabled={!template || !excelFileName}
      >
        Generuj certyfikaty
      </button>
    </section>
  )
}
