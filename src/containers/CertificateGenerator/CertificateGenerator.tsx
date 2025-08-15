import React, { useRef, useState } from 'react'
import domtoimage from 'dom-to-image-more'
import type { DraggingType, ExtraText, Position } from './types'
import { CertificatePreview } from './components/CertificatePreview'
import { Box } from '../../components'

export const CertificateGenerator = () => {
  const [generatedNames, setGeneratedNames] = useState<string[]>(['Name'])
  const [template, setTemplate] = useState<string | null>(null)
  const [position, setPosition] = useState<Position>({ x: 200, y: 200 })
  const [qrPosition, setQrPosition] = useState<Position>({ x: 200, y: 200 })
  const [qrSize, setQrSize] = useState<number>(100)
  const [input, setInput] = useState<string>('')
  const [qrCode, setQrcode] = useState<string>('')
  const [extraTexts, setExtraTexts] = useState<ExtraText[]>([])

  const componentRefs = useRef<Array<HTMLDivElement | null>>([])

  // const handleDownloadAll = async () => {
  //   for (let i = 0; i < componentRefs.current.length; i++) {
  //     const ref = componentRefs.current[i]

  //     if (ref) {
  //       try {
  //         const dataUrl = await domtoimage.toPng(ref)
  //         const link = document.createElement('a')

  //         link.href = dataUrl
  //         link.download = `certificate-${i + 1}.png`
  //         link.click()
  //       } catch (error) {
  //         console.error('Error capturing certificate:', error)
  //       }
  //     }
  //   }
  // }

  function handleUploadTemplate(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      setTemplate(reader.result as string)
    }

    if (file) {
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

  // function handleGenerateQrCode() {
  //   setQrcode(input)
  // }

  return (
    <section className='relative mt-12 md:mt-16'>
      <Box>
        <div className='my-4'>
          <label className='mb-2'>Upload Template</label>

          <input
            type='file'
            accept='image/*'
            onChange={handleUploadTemplate}
            className='w-full p-2 border rounded-md'
          />
        </div>
      </Box>

      <Box>
        {template ? (
          <div className='flex flex-col gap-6'>
            {generatedNames.map((name, index) => (
              <div key={index}>
                <CertificatePreview
                  name={name}
                  template={template}
                  position={position}
                  qrPosition={qrPosition}
                  handleStop={handleStop}
                  qrSize={qrSize}
                  qr={qrCode}
                  innerRef={(el) => (componentRefs.current[index] = el)}
                  extraTexts={extraTexts}
                />
              </div>
            ))}
          </div>
        ) : null}
      </Box>
    </section>
  )
}
