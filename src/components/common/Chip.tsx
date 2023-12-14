import { twsx } from '../../utils/dom'

const Chip = ({
  text,
  className,
  title,
}: {
  text?: string
  className?: string
  title?: string
}) => {
  return (
    <span
      className={twsx(
        'rounded-full bg-gray-200 px-1 py-0.5 text-xs font-bold text-gray-500 transition dark:bg-gray-800',
        className,
      )}
      title={title}
    >
      {text}
    </span>
  )
}

export default Chip
