import type { DraggingType, Position, TextStyle } from '../../types'
import { useEffect, useState } from 'react'
import { DnDContent } from './components/DnDContent'
import { FONTS } from './constants'
import { Content } from './components/Content'

const defaultStyles: TextStyle = {
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  color: '#000',
  fontFamily: FONTS[0],
  fontSize: 48,
}

interface Props {
  name: string
  position: Position
  qr: string
  qrPosition: Position
  qrSize: number
  template: string | null
  dnd: boolean
  extraTexts: { id: string; value: string; position: Position }[]
  active: boolean
  onActivate: () => void
  innerRef: (el: HTMLDivElement | null) => void
  onStop: (type: DraggingType, data: Position, id?: string) => void
  onDownload: () => void
}

export const CertificatePreview = ({
  name,
  position,
  qr,
  qrPosition,
  qrSize,
  template,
  dnd,
  extraTexts,
  active,
  onActivate,
  innerRef,
  onStop,
  onDownload,
}: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  const [textStyles, setTextStyles] = useState<Record<string, TextStyle>>({
    name: defaultStyles,
    ...extraTexts.reduce((acc, t) => {
      acc[`extra-${t.id}`] = defaultStyles

      return acc
    }, {} as Record<string, TextStyle>),
  })

  const handleChangeStyles = (id: string, newStyle: Partial<TextStyle>) => {
    setTextStyles((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...newStyle },
    }))
  }

  useEffect(() => {
    if (dnd) {
      setActiveId(null)
    }
  }, [dnd])

  return (
    <div
      className='relative'
      ref={innerRef}
      onClick={() => setActiveId(null)}
      style={{
        userSelect: 'none',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      {active ? (
        <div className='absolute top-0 right-0 w-full flex items-end justify-end bg-gray-700/70 text-white px-4 py-2 z-10'>
          <button
            type='button'
            onClick={onDownload}
            className='relative flex items-center gap-2 text-white font-medium transition group'
          >
            <span className='relative cursor-pointer'>
              Pobierz
              <span className='absolute left-1/2 -bottom-0.5 w-0 h-[2px] bg-white transition-all duration-300 ease-out group-hover:w-full group-hover:left-0' />
            </span>
          </button>
        </div>
      ) : null}

      {template ? (
        <div
          onClick={onActivate}
          className={`relative ${active ? 'ring-4 ring-orange-500' : 'ring-0'}`}
        >
          <img
            src={template}
            alt='template'
            className='w-full shadow-lg border-none'
            draggable={false}
          />
        </div>
      ) : null}

      {dnd ? (
        <DnDContent
          name={name}
          qr={qr}
          qrSize={qrSize}
          position={position}
          qrPosition={qrPosition}
          activeId={activeId}
          textStyles={textStyles}
          extraTexts={extraTexts}
          dnd={dnd}
          onStop={onStop}
        />
      ) : (
        <Content
          name={name}
          qr={qr}
          qrSize={qrSize}
          position={position}
          qrPosition={qrPosition}
          activeId={activeId}
          dnd={dnd}
          textStyles={textStyles}
          extraTexts={extraTexts}
          onChangeActiveId={setActiveId}
          onChangeStyles={handleChangeStyles}
        />
      )}
    </div>
  )
}
