import { useDraggable } from '@dnd-kit/core'
import type { Position, TextStyle } from '../../../../types'
import type React from 'react'
import { Menu } from './components/Menu'

interface Props {
  id: string
  position: Position
  children: React.ReactNode
  active?: boolean
  dnd?: boolean
  textStyles?: TextStyle
  onClick?: (e: React.MouseEvent) => void
  onChangeStyles?: (id: string, newStyle: Partial<TextStyle>) => void
}

export const DraggableItem = ({
  id,
  position,
  children,
  active,
  dnd = false,
  textStyles,
  onClick,
  onChangeStyles,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        left: transform ? position.x + transform.x : position.x,
        top: transform ? position.y + transform.y : position.y,
        touchAction: 'none',
        outline: 'none',
        border: 'none',
        boxShadow: 'none',
      }}
      className={`absolute z-10 rounded-lg px-2 ${
        dnd ? 'cursor-move' : 'cursor-default'
      }`}
      {...attributes}
      {...(dnd ? listeners : {})}
      onClick={onClick}
    >
      {active && (
        <Menu
          onBold={() =>
            onChangeStyles?.(id, {
              fontWeight: textStyles?.fontWeight === 'bold' ? 'normal' : 'bold',
            })
          }
          onItalic={() =>
            onChangeStyles?.(id, {
              fontStyle:
                textStyles?.fontStyle === 'italic' ? 'normal' : 'italic',
            })
          }
          onUnderline={() =>
            onChangeStyles?.(id, {
              textDecoration:
                textStyles?.textDecoration === 'underline'
                  ? 'none'
                  : 'underline',
            })
          }
          onColor={(color) => onChangeStyles?.(id, { color })}
          onFontChange={(font) => onChangeStyles?.(id, { fontFamily: font })}
        />
      )}

      {children}
    </div>
  )
}
