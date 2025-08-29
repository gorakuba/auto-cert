type Props = {
  href: string
  label: string
}

export const Item = ({ href, label }: Props) => (
  <li key={label}>
    <a
      href={href}
      className='duration-300 font-medium ease-linear hover:text-primary py-3'
    >
      {label}
    </a>
  </li>
)
