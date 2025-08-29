import { FaSpinner } from 'react-icons/fa'

export const Loader = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[9999]'>
      <div className='flex flex-col items-center gap-4'>
        <FaSpinner className='animate-spin text-orange-500 text-5xl' />
      </div>
    </div>
  )
}
