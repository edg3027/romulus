import { twsx } from '../../utils/dom'
import Loader from './Loader'
import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  template?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  loading?: boolean
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  template = 'primary',
  children,
  className,
  loading,
  disabled,
  ...props
}) => {
  return (
    <button
      className={twsx(
        'flex h-8 items-center justify-center rounded px-3 py-1 text-sm font-semibold outline-none transition',
        (disabled || loading) && 'pointer-events-none',
        template === 'primary' &&
          (disabled
            ? 'border border-transparent bg-gray-300 text-gray-500 dark:bg-gray-700'
            : 'border border-transparent bg-primary-500 text-gray-100 hover:bg-primary-600 focus:border-secondary-500 active:bg-primary-700 dark:bg-primary-600'),
        template === 'secondary' &&
          (disabled
            ? 'border border-gray-400 bg-transparent text-gray-400 dark:border-gray-500 dark:text-gray-500'
            : 'border border-primary-500 bg-transparent text-primary-500 hover:border-primary-600 hover:bg-gray-200 hover:text-primary-600 focus:border-secondary-500 active:border-primary-700 active:text-primary-700 dark:border-primary-700 dark:text-primary-500 dark:hover:bg-gray-800'),
        template === 'tertiary' &&
          (disabled
            ? 'border border-transparent bg-transparent text-gray-400 dark:text-gray-500'
            : 'border border-transparent bg-transparent text-primary-500 hover:bg-gray-200 focus:border-secondary-500 active:bg-gray-300 dark:hover:bg-gray-800'),
        template === 'danger' &&
          (disabled
            ? 'border border-transparent bg-gray-300 text-gray-500 dark:bg-gray-700'
            : 'border border-transparent bg-error-500 text-gray-100 hover:bg-error-600 focus:border-error-800 active:bg-error-700'),
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader className='text-inherit mr-1.5' size={14} />}
      {children}
    </button>
  )
}

export default Button
