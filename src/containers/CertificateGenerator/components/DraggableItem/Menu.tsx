import { MdFontDownload } from 'react-icons/md'
import { FONTS } from '../constants'
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import type { TextStyle } from '../types'

interface Props {
  textStyles?: TextStyle
  onBold?: () => void
  onItalic?: () => void
  onUnderline?: () => void
  onColor?: (color: string) => void
  onFontChange?: (font: string) => void
}

export const Menu = ({
  textStyles,
  onBold,
  onItalic,
  onUnderline,
  onColor,
  onFontChange,
}: Props) => {
  const [showFontSelect, setShowFontSelect] = useState(false)

  const [selectedFont, setSelectedFont] = useState(textStyles?.fontFamily)
  const [selectedColor, setSelectedColor] = useState(textStyles?.color)

  const buttonClass =
    'bg-transparent border-0 cursor-pointer p-1.5 text-[18px] flex items-center justify-center text-gray-800 hover:bg-gray-200 rounded'

  useEffect(() => {
    if (textStyles?.fontFamily) {
      setSelectedFont(textStyles.fontFamily)
    }

    if (textStyles?.color) {
      setSelectedColor(textStyles.color)
    }
  }, [textStyles])

  return (
    <div className='absolute top-[-50px] right-[20px] bg-gray-50 border border-gray-300 rounded p-1.5 shadow-md z-20 flex gap-1.5'>
      <button onClick={onBold} className={buttonClass} title='Bold'>
        <FaBold />
      </button>

      <button onClick={onItalic} className={buttonClass} title='Italic'>
        <FaItalic />
      </button>

      <button onClick={onUnderline} className={buttonClass} title='Underline'>
        <FaUnderline />
      </button>

      <label className='flex items-center cursor-pointer'>
        <input
          value={selectedColor}
          type='color'
          className='border-0 w-5 h-6 p-0 bg-transparent cursor-pointer'
          onChange={(e) => {
            onColor?.(e.target.value)
            setSelectedColor(e.target.value)
          }}
        />
      </label>

      <div className='relative'>
        <button
          onClick={() => setShowFontSelect((v) => !v)}
          className={buttonClass}
          title='Font'
        >
          <MdFontDownload />
        </button>

        {showFontSelect && (
          <div className='absolute top-[120%] left-0 bg-white border border-gray-300 rounded-lg shadow-md z-50'>
            <select
              size={12}
              value={selectedFont}
              onChange={(e) => {
                onFontChange?.(e.target.value)
                setSelectedFont(e.target.value)
                setShowFontSelect(false)
              }}
              className='border-0 outline-none w-[180px] text-sm bg-transparent'
            >
              {FONTS.map((font) => (
                <option
                  key={font}
                  value={font}
                  className={`p-1 ${
                    font === selectedFont
                      ? 'bg-[#aa824f] text-white'
                      : 'bg-transparent'
                  }`}
                  style={{
                    fontFamily: font,
                  }}
                >
                  {font}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
