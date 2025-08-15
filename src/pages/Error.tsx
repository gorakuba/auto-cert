import { Link } from 'react-router'

export const Error = () => (
  <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6'>
    <h1 className='text-5xl font-bold text-orange-500 mb-4'>Oops!</h1>
    <p className='text-lg text-gray-700 mb-2'>
      Something went wrong. Please try again later
    </p>

    <Link to={'/'}>
      <button className='mt-6 px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition'>
        Back home
      </button>
    </Link>
  </div>
)
