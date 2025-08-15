import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export const Box = ({ children, className = '' }: Props) => (
  <div
    className={`mx-auto max-w-7xl w-full px-5 sm:px-8 md:px-14 lg:px-5 ${className}`}
  >
    {children}
  </div>
)
