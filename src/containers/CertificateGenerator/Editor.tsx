import { useState } from 'react'
import { Box } from '../../components'
import { useCertificateContext } from '../../contexts'
import { Preview } from './components/Preview'

export const Editor = () => {
  const {
    generatedNames,
    template,
    componentRefs,
    downloadSingle,
    downloadAll,
    changeQrcode,
    reset,
  } = useCertificateContext()

  const [dnd, setDnd] = useState(false)
  const [input, setInput] = useState<string>('')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleDndOn = () => {
    setDnd((v) => !v)
    setActiveIndex(null)
  }

  const handleGenerateClick = () => {
    changeQrcode(input)
  }

  const handleDownloadSingleClick = (i: number) => {
    setActiveIndex(null)
    downloadSingle(i)
  }

  const handleDownloadAllClick = () => {
    setActiveIndex(null)
    downloadAll()
  }

  return (
    <section className='flex flex-col h-screen overflow-y-auto'>
      <div className='sticky top-0 left-0 right-0 z-50 w-full bg-white shadow-md border-b border-gray-200'>
        <div className='flex items-center justify-between px-6 py-3'>
          <div className='flex flex-row gap-4'>
            <div className='gap-2 flex items-center'>
              <label className='flex items-center space-x-2 select-none'>
                <span
                  className={`font-medium ${!template ? 'opacity-50' : ''}`}
                >
                  Move
                </span>
                <button
                  type='button'
                  role='switch'
                  disabled={!template}
                  aria-checked={dnd}
                  onClick={handleDndOn}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    dnd ? 'bg-orange-500' : 'bg-gray-300'
                  } ${!template ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      dnd ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <div className='h-8 w-[0.1rem] rounded-2xl bg-gray-300' />

              <div className='flex items-center gap-2'>
                <input
                  id='qr-input'
                  type='url'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className='px-4 py-1 border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors w-64'
                  placeholder='Enter info for QR code...'
                />
                <button
                  disabled={!input}
                  type='button'
                  className={`px-4 py-1 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition-colors font-semibold ${
                    !input ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleGenerateClick}
                >
                  Generate QR
                </button>
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-4'>
            <button
              type='button'
              onClick={handleDownloadAllClick}
              disabled={!generatedNames.length}
              className={`relative flex items-center gap-2 font-medium hover:text-orange-500 transition group
              ${
                !generatedNames.length
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:text-orange-600'
              }
            `}
            >
              <span className='relative cursor-pointer'>
                Pobierz wszystkie
                <span className='absolute left-1/2 -bottom-0.5 w-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0' />
              </span>
            </button>

            <button
              type='button'
              onClick={reset}
              className='flex items-center gap-1 hover:text-orange-500 transition-colors group'
              title='Wróć do przesyłania'
            >
              <span className='font-medium relative cursor-pointer'>
                Powrót
                <span className='absolute left-1/2 -bottom-0.5 w-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0' />
              </span>
            </button>
          </div>
        </div>
      </div>

      <Box className='flex flex-col justify-between gap-6 my-4'>
        {generatedNames.map((name, index) => (
          <Preview
            key={index}
            name={name}
            dnd={dnd}
            qrSize={80}
            innerRef={(el) => (componentRefs.current[index] = el)}
            onDownload={() => handleDownloadSingleClick(index)}
            active={activeIndex === index}
            onActivate={() => {
              if (activeIndex === index) {
                setActiveIndex(null)
              } else {
                setActiveIndex(index)
              }
            }}
          />
        ))}
      </Box>
    </section>
  )
}
