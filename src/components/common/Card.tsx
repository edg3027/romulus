import { twsx } from '../../utils/dom'
import { ReactNode } from 'react'

const Card = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={twsx(
        'rounded-lg border border-gray-200 bg-gray-100 transition dark:border-gray-800 dark:bg-gray-900',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Card
