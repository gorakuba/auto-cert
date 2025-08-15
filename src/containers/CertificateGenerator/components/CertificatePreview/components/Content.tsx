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
          className={activeId === 'name' ? 'inline-block' : 'inline-block'}
          style={{
            ...textStyles['name'],
            outline: 'none',
            boxShadow: 'none',
          }}
        >
          {name || 'Sample Name'}
        </h1>
      </Item>

      {qr ? (
        <Item
          id='qr'
          position={qrPosition}
          onClick={(e) => handleClick(e, 'qr')}
          active={activeId === 'qr'}
        >
          <QRCode value={qr} size={qrSize} />
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
          <div className={`cursor-default`} style={{ fontSize: '24px' }}>
            {text.value}
          </div>
        </Item>
      ))}
    </>
  )
}
