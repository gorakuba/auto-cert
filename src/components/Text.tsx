import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export const Text = ({ children, className = '' }: Props) => (
  <p className={`text-accent md:text-lg ${className}`}>{children}</p>
)
