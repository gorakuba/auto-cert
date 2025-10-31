import { useEffect, useState } from 'react'
import { FONTS } from './constants'
import type { TextStyle } from './types'
import { useCertificateContext } from '../../../contexts'
import { Content } from './Content'

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
  qrSize: number
  dnd: boolean
  active: boolean
  onActivate: () => void
  innerRef: (el: HTMLDivElement | null) => void
  onDownload: () => void
}

export const Preview = ({
  name,
  qrSize,
  dnd,
  active,
  onActivate,
  innerRef,
  onDownload,
}: Props) => {
  const { template, qrCode } = useCertificateContext()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [textStyles, setTextStyles] = useState<Record<string, TextStyle>>({
    name: defaultStyles,
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
      className='relative select-none bg-transparent border-none shadow-none cursor-pointer'
      ref={innerRef}
      onClick={() => setActiveId(null)}
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

      <Content
        name={name}
        qr={qrCode}
        qrSize={qrSize}
        activeId={activeId}
        dnd={dnd}
        textStyles={textStyles}
        onChangeActiveId={setActiveId}
        onChangeStyles={handleChangeStyles}
      />
    </div>
  )
}
