type Props = {
  href: string
  label: string
  className?: string
}

export const Link = ({ href, label, className = '' }: Props) => (
  <a
    href={href}
    className={`px-6 py-3 rounded-full outline-none relative overflow-hidden border bg-orange-600 cursor-pointer transform transition duration-300 ${className}`}
  >
    <span className='relative z-10 text-white'>{label}</span>
  </a>
)
