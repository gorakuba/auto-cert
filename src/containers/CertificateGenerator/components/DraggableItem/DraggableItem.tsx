import { useDraggable } from '@dnd-kit/core'
import type { TextStyle } from '../types'
import { useCertificateContext } from '../../../../contexts'
import { Menu } from './Menu'

interface Props {
  id: string
  children: React.ReactNode
  active?: boolean
  dnd?: boolean
  textStyles?: TextStyle
  onClick?: (e: React.MouseEvent) => void
  onChangeStyles?: (id: string, newStyle: Partial<TextStyle>) => void
}

export const DraggableItem = ({
  id,
  children,
  active,
  dnd = false,
  textStyles,
  onClick,
  onChangeStyles,
}: Props) => {
  const { position } = useCertificateContext()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        left: transform ? position.x + transform.x : position.x,
        top: transform ? position.y + transform.y : position.y,
      }}
      className={`absolute z-10 rounded-lg px-2 ${
        dnd ? 'cursor-move' : 'cursor-default'
      } touch-none outline-none border-none shadow-none`}
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
