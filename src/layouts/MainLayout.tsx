import { useEffect, type ReactNode } from 'react'
import { Navbar } from '../containers'

type Props = {
  title: string
  children: ReactNode
}

export const MainLayout = ({ title, children }: Props) => {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <>
      <Navbar />

      <main className='flex flex-col gap-y-20 md:gap-y-32 h-screen min-h-screen overflow-y-auto overscroll-y-contain'>
        {children}
      </main>
    </>
  )
}
