export type Position = {
  x: number
  y: number
}

export type ExtraText = {
  id: string
  value: string
  position: Position
}

export type DraggingType = 'name' | 'qr'
