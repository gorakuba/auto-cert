import type { DraggingType, Position, TextStyle } from '../../types'
import { useState } from 'react'
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
  innerRef: (el: HTMLDivElement | null) => void
  handleStop: (type: DraggingType, data: Position, id?: string) => void
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
  innerRef,
  handleStop,
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
      {template && (
        <img
          src={template}
          alt='template'
          className='w-full shadow-lg border-none'
          draggable={false}
        />
      )}

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
          onStop={handleStop}
        />
      ) : (
        <Content
          name={name}
          qr={qr}
          qrSize={qrSize}
          position={position}
          qrPosition={qrPosition}
          activeId={activeId}
          textStyles={textStyles}
          extraTexts={extraTexts}
          onChangeActiveId={setActiveId}
          onChangeStyles={handleChangeStyles}
        />
      )}
    </div>
  )
}
