import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import type { DraggingType, Position, TextStyle } from '../../../types'
import { DraggableItem } from './DraggableItem'
import QRCode from 'react-qr-code'

interface Props {
  name: string
  qr: string
  qrSize: number
  position: Position
  qrPosition: Position
  activeId: string | null
  dnd: boolean
  textStyles: Record<string, TextStyle>
  extraTexts: { id: string; value: string; position: Position }[]
  onStop: (type: DraggingType, data: Position, id?: string) => void
}

export const DnDContent = ({
  name,
  qr,
  qrSize,
  position,
  qrPosition,
  activeId,
  textStyles,
  extraTexts,
  onStop,
  dnd,
}: Props) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const id = active.id

    if (id === 'name') {
      onStop('name', {
        x: position.x + delta.x,
        y: position.y + delta.y,
      })
    }

    if (id === 'qr') {
      onStop('qr', {
        x: qrPosition.x + delta.x,
        y: qrPosition.y + delta.y,
      })
    }

    if (typeof id === 'string' && id.startsWith('extra-')) {
      const extraId = id.slice(6)

      onStop(
        'extraTexts',
        {
          x: extraTexts.find((t) => t.id === id)?.position.x! + delta.x,
          y: extraTexts.find((t) => t.id === id)?.position.y! + delta.y,
        },
        extraId
      )
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <DraggableItem id='name' position={position} dnd>
        <h1
          // className='w-[50vw] outline-none shadow-none font-bold text-3xl text-center'
          className={`w-[50vw] text-center ${
            activeId === 'name' && !dnd
              ? 'border-2 border-dashed border-orange-500 rounded-2xl'
              : 'border-none'
          }`}
          style={{
            ...textStyles['name'],
            userSelect: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
            WebkitBoxShadow: 'none',
            MozBoxShadow: 'none',
          }}
        >
          {name}
        </h1>
      </DraggableItem>

      {qr ? (
        <DraggableItem id='qr' position={qrPosition} dnd>
          <div
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              WebkitBoxShadow: 'none',
              MozBoxShadow: 'none',
              padding: 0,
            }}
          >
            <QRCode
              value={qr}
              size={qrSize}
              bgColor='transparent'
              style={{ border: 'none' }}
            />
          </div>
        </DraggableItem>
      ) : null}

      {extraTexts.map((text) => (
        <DraggableItem
          key={text.id}
          id={`extra-${text.id}`}
          position={text.position}
          active={activeId === `extra-${text.id}`}
          dnd
        >
          <div
            className='cursor-move text-2xl font-medium'
            style={{
              fontSize: '24px',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              WebkitBoxShadow: 'none',
              MozBoxShadow: 'none',
              padding: 0,
            }}
          >
            {text.value}
          </div>
        </DraggableItem>
      ))}
    </DndContext>
  )
}
