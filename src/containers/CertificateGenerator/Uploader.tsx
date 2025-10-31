import React, { useState } from 'react'
import { FaFileImage, FaUsers } from 'react-icons/fa'
import { useCertificateContext } from '../../contexts'

export const Uploader = () => {
  const { template, uploadTemplateFile, uploadExcelFile, changeGenerated } =
    useCertificateContext()

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [excelFileName, setExcelFileName] = useState<string | null>(null)

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setSelectedFileName(file.name)
      uploadTemplateFile(file)
    }
  }

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setExcelFileName(file.name)
      uploadExcelFile(file)
    }
  }

  const templateLoaded = !!template
  const canGenerate = templateLoaded && !!excelFileName

  return (
    <section className='flex flex-col items-center justify-center text-center h-full'>
      <h1 className='text-5xl font-bold text-gray-800 mb-8'>
        Certificate Generator
      </h1>

      <img
        src='https://cdn-icons-png.flaticon.com/512/3135/3135755.png'
        alt='Certificate illustration'
        className='w-32 h-32 mx-auto mb-8 opacity-90'
      />

      <p className='text-gray-600 max-w-xl mx-auto mb-6'>
        Wczytaj szablon certyfikatu oraz listę osób z pliku Excel, aby
        wygenerować certyfikaty
      </p>

      <div className='w-full max-w-md mx-auto border-2 border-dashed border-orange-400 rounded-xl overflow-hidden bg-orange-50'>
        <div className='h-1/2 flex flex-col items-center justify-center p-4 gap-2 border-b border-dashed border-gray-300 bg-white transition-shadow hover:bg-orange-100 cursor-pointer'>
          <input
            id='template-upload'
            type='file'
            accept='image/*'
            onChange={handleTemplateChange}
            className='hidden'
          />
          <label
            htmlFor='template-upload'
            className='flex flex-col items-center justify-center w-full h-full cursor-pointer'
          >
            <div className='text-4xl mb-2 text-orange-400'>
              <FaFileImage />
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {selectedFileName ? selectedFileName : 'Wybierz szablon'}
            </span>
            {!selectedFileName && (
              <span className='text-xs text-gray-400'>
                (*.png, *.jpg, *.jpeg, *.gif, *.bmp, *.webp, *.svg)
              </span>
            )}
          </label>
        </div>

        <div
          className={`h-1/2 flex flex-col items-center justify-center p-4 gap-2 transition-shadow ${
            templateLoaded
              ? 'bg-white hover:bg-orange-100 cursor-pointer'
              : 'bg-gray-100 opacity-50 cursor-not-allowed'
          }`}
        >
          <input
            id='excel-upload'
            type='file'
            accept='.xlsx, .xls'
            onChange={handleExcelChange}
            className='hidden'
            disabled={!templateLoaded}
          />
          <label
            htmlFor='excel-upload'
            className={`flex flex-col items-center justify-center w-full h-full ${
              templateLoaded ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
          >
            <div className='text-4xl mb-2 text-green-400'>
              <FaUsers />
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {excelFileName ? excelFileName : 'Dodaj osoby'}
            </span>
            {!excelFileName && (
              <span className='text-xs text-gray-400'>(*.xlsx)</span>
            )}
          </label>
        </div>
      </div>

      <button
        className={`w-full max-w-md mx-auto mt-8 px-6 py-3 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition font-bold text-lg ${
          !canGenerate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => changeGenerated(true)}
        disabled={!canGenerate}
      >
        Generuj certyfikaty
      </button>
    </section>
  )
}
