import QRCode from 'react-qr-code'
import type { Position, TextStyle } from '../../../types'
import { DraggableItem as Item } from './DraggableItem'

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
  onChangeActiveId: (id: string | null) => void
  onChangeStyles: (id: string, newStyle: Partial<TextStyle>) => void
}

export const Content = ({
  name,
  qr,
  qrSize,
  position,
  qrPosition,
  activeId,
  dnd,
  textStyles,
  extraTexts,
  onChangeActiveId,
  onChangeStyles,
}: Props) => {
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    onChangeActiveId(id)
  }

  return (
    <>
      <Item
        id='name'
        position={position}
        onClick={(e) => handleClick(e, 'name')}
        active={activeId === 'name'}
        textStyles={textStyles['name']}
        onChangeStyles={onChangeStyles}
      >
        <h1
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
      </Item>

      {qr ? (
        <Item
          id='qr'
          position={qrPosition}
          onClick={(e) => handleClick(e, 'qr')}
          active={activeId === 'qr'}
        >
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
        </Item>
      ) : null}

      {extraTexts.map((text) => (
        <Item
          key={text.id}
          id={`extra-${text.id}`}
          position={text.position}
          onClick={(e) => handleClick(e, `extra-${text.id}`)}
          active={activeId === `extra-${text.id}`}
        >
          <div
            className='cursor-default'
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
        </Item>
      ))}
    </>
  )
}
