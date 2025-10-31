import React from 'react'
import QRCode from 'react-qr-code'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import type { TextStyle } from './types'
import { useCertificateContext } from '../../../contexts'
import { DraggableItem } from './DraggableItem'

interface Props {
  name: string
  qr: string
  qrSize: number
  activeId: string | null
  dnd: boolean
  textStyles: Record<string, TextStyle>
  onChangeActiveId?: (id: string | null) => void
  onChangeStyles?: (id: string, newStyle: Partial<TextStyle>) => void
}

export const Content = ({
  name,
  qr,
  qrSize,
  activeId,
  dnd,
  textStyles,
  onChangeActiveId,
  onChangeStyles,
}: Props) => {
  const { stop, position, qrPosition } = useCertificateContext()

  const handleClick = (e: React.MouseEvent, id: string) => {
    if (dnd || !onChangeActiveId) {
      return
    }

    e.stopPropagation()
    onChangeActiveId(id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (!dnd) {
      return
    }

    const { active, delta } = event
    const id = active.id

    if (id === 'name') {
      stop('name', {
        x: position.x + delta.x,
        y: position.y + delta.y,
      })

      return
    }

    if (id === 'qr') {
      stop('qr', {
        x: qrPosition.x + delta.x,
        y: qrPosition.y + delta.y,
      })

      return
    }
  }

  const content = (
    <>
      <DraggableItem
        id='name'
        onClick={(e) => handleClick(e, 'name')}
        active={activeId === 'name'}
        textStyles={textStyles['name']}
        onChangeStyles={onChangeStyles}
        dnd={dnd}
      >
        <h1
          className={`w-[50vw] text-center ${
            activeId === 'name' && !dnd
              ? 'border-2 border-dashed border-orange-500 rounded-2xl'
              : 'border-none'
          } ${
            dnd ? 'cursor-move' : 'cursor-default'
          } select-none outline-none shadow-none bg-transparent`}
          style={{
            ...textStyles['name'],
          }}
        >
          {name}
        </h1>
      </DraggableItem>

      {qr ? (
        <DraggableItem
          id='qr'
          onClick={(e) => handleClick(e, 'qr')}
          active={activeId === 'qr'}
          dnd={dnd}
        >
          <div
            className={`${
              dnd ? 'cursor-move' : 'cursor-default'
            } bg-transparent border-none shadow-none p-0`}
          >
            <QRCode
              value={qr}
              size={qrSize}
              bgColor='transparent'
              className='border-none block'
            />
          </div>
        </DraggableItem>
      ) : null}
    </>
  )

  if (dnd) {
    return <DndContext onDragEnd={handleDragEnd}>{content}</DndContext>
  }

  return <>{content}</>
}
