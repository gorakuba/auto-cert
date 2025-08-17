import React, { useRef, useState } from 'react'
import domtoimage from 'dom-to-image-more'
import type { DraggingType, ExtraText, Position } from './types'
import { CertificatePreview } from './components/CertificatePreview'
import { Box } from '../../components'
import { FaDownload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'

export const CertificateGenerator = () => {
  const [generatedNames, setGeneratedNames] = useState<string[]>([
    'Your name...',
  ])
  const [template, setTemplate] = useState<string | null>(null)
  const [position, setPosition] = useState<Position>({ x: 200, y: 200 })
  const [qrPosition, setQrPosition] = useState<Position>({ x: 200, y: 200 })
  const [qrSize, setQrSize] = useState<number>(100)
  const [input, setInput] = useState<string>('')
  const [qrCode, setQrcode] = useState<string>('')
  const [extraTexts, setExtraTexts] = useState<ExtraText[]>([])
  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [dndEnabled, setDndEnabled] = useState(false)

  const componentRefs = useRef<Array<HTMLDivElement | null>>([])

  const handleDownloadAll = async () => {
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

  return (
    <section
      className='relative my-2'
      style={{
        height: '100vh',
        overflowY: 'auto',
        paddingBottom: '100px', // space for fixed button
        marginBottom: '100px', // space for fixed button
      }}
    >
      <Box className='flex items-center justify-between'>
        <div className='flex items-center gap-4 my-4'>
          <label htmlFor='name-input' className='font-semibold text-gray-700'>
            Name:
          </label>

          <input
            id='name-input'
            type='text'
            value={generatedNames[0]}
            onChange={(e) => setGeneratedNames([e.target.value])}
            className='px-4 py-2 border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors w-64'
            placeholder='Enter name...'
          />

          <label
            htmlFor='template-upload'
            className='cursor-pointer flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition-colors font-semibold'
          >
            <span>Choose certificate</span>
          </label>

          <input
            id='template-upload'
            type='file'
            accept='image/*'
            onChange={handleUploadTemplate}
            className='hidden'
          />

          {selectedFileName && (
            <span className='text-sm truncate max-w-xs'>
              {selectedFileName}
            </span>
          )}
        </div>

        {template ? (
          <label className='flex items-center space-x-3 select-none'>
            <span className='font-medium'>Drag & Drop</span>
            <button
              type='button'
              role='switch'
              aria-checked={dndEnabled}
              onClick={() => setDndEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                dndEnabled ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  dndEnabled ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        ) : null}
      </Box>

      {template ? (
        <>
          <Box className='flex flex-col gap-6'>
            {template
              ? generatedNames.map((name, index) => (
                  <CertificatePreview
                    key={index}
                    name={name}
                    template={template}
                    position={position}
                    qrPosition={qrPosition}
                    handleStop={handleStop}
                    dnd={dndEnabled}
                    qrSize={qrSize}
                    qr={qrCode}
                    innerRef={(el) => (componentRefs.current[index] = el)}
                    extraTexts={extraTexts}
                  />
                ))
              : null}
          </Box>

          <Box>
            <div className='flex items-center gap-2 my-4'>
              <label htmlFor='qr-input' className='font-semibold text-gray-700'>
                QR info:
              </label>
              <input
                id='qr-input'
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors w-64'
                placeholder='Enter info for QR code...'
              />
              <button
                type='button'
                className='px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition-colors font-semibold'
                onClick={handleGenerateQrCode}
              >
                Generate QR
              </button>
            </div>
          </Box>

          <div className='fixed left-0 bottom-4 w-full flex justify-center z-50 bg-transparent'>
            <button
              type='button'
              className='w-full max-w-xl flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-colors font-bold text-lg cursor-pointer'
              onClick={handleDownloadAll}
            >
              <FaDownload className='mr-2' />
              Pobierz certyfikat
            </button>
          </div>
        </>
      ) : null}
    </section>
  )
}
