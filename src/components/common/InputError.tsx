import { twsx } from '../../utils/dom'
import { FC, PropsWithChildren } from 'react'

const InputError: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div className={twsx('text-xs italic text-error-500', className)}>
    {children}
  </div>
)

export default InputError
