import type { CSSProperties } from 'react'

export type Position = {
  x: number
  y: number
}

export type ExtraText = {
  id: string
  value: string
  position: Position
}

export type TextStyle = {
  fontWeight: CSSProperties['fontWeight']
  fontStyle: CSSProperties['fontStyle']
  textDecoration: CSSProperties['textDecoration']
  color: CSSProperties['color']
  fontFamily: CSSProperties['fontFamily']
  fontSize: CSSProperties['fontSize']
}

export type DraggingType = 'name' | 'qr' | 'customImage' | 'extraTexts'
