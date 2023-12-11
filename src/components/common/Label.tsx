import { twsx } from '../../utils/dom'
import { FC, LabelHTMLAttributes } from 'react'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

const Label: FC<LabelProps> = ({ children, className, ...props }) => (
  <label
    className={twsx(
      'block text-sm font-semibold text-gray-700 dark:text-gray-300',
      className,
    )}
    {...props}
  >
    {children}
  </label>
)

export default Label
