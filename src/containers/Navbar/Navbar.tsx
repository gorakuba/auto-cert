import { Box, Link } from '../../components'
import logo from '../../assets/logo.svg'
import { Item } from './components/Item'
import { useThemeContext } from '../../contexts'

const ITEMS = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const Navbar = () => {
  const { darkMode, toggleTheme } = useThemeContext()

  return (
    <header className='relative inset-x-0 top-0 z-50 py-6 bg-white shadow-md'>
      <Box>
        <nav className='w-full flex justify-between gap-6 relative'>
          <div className='min-w-max inline-flex relative'>
            <a href='/' className='relative flex items-center gap-1'>
              <img src={logo} alt='Logo' className='w-10 h-10' />

              <div className='inline-flex text-lg font-semibold text-primary'>
                AutoCert
              </div>
            </a>
          </div>

          {/* <div className='flex flex-col lg:flex-row w-full lg:justify-between lg:items-center absolute top-full left-0 lg:static lg:top-0 bg lg:bg-transparent border-x border-x-box-border lg:border-x-0 lg:h-auto h-0 overflow-hidden'>
            <ul className='border-t border-box-border lg:border-t-0 px-6 lg:px-0 pt-6 lg:pt-0 flex flex-col lg:flex-row gap-y-4 gap-x-3 text-lg text-muted w-full lg:justify-center lg:items-center'>
              {ITEMS.map(({ href, label }) => (
                <Item key={href} href={href} label={label} />
              ))}
            </ul>

            <div className='lg:min-w-max flex items-center sm:w-max w-full pb-6 lg:pb-0 border-b border-box-border lg:border-0 px-6 lg:px-0'>
              <Link label='Get started' href='#cta' />
            </div>
          </div> */}

          <div className='min-w-max flex items-center gap-x-3'>
            <button
              onClick={toggleTheme}
              className='outline-hidden flex relative text-muted rounded-full p-2 lg:p-3 border border-box-border cursor-pointer'
            >
              {darkMode ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </Box>
    </header>
  )
}
