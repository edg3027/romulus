import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'

import { twsx } from '../../utils/dom'
import Loader from './Loader'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

const commonStyles =
  'border-2 font-bold rounded-sm p-1 px-4 flex items-center justify-center'

export const ButtonPrimary: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  loading,
  ...props
}) => (
  <button
    className={twsx(
      'border-transparent bg-blue-600 text-white',
      'hover:bg-blue-700',
      'disabled:bg-gray-600',
      commonStyles,
      className
    )}
    {...props}
  >
    {loading && <Loader className='text-white mr-1' size={16} />}
    {children}
  </button>
)

export const ButtonPrimaryRed: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  loading,
  ...props
}) => (
  <button
    className={twsx(
      'border-transparent bg-red-600 text-white',
      'hover:bg-red-700',
      'disabled:bg-gray-600',
      commonStyles,
      className
    )}
    {...props}
  >
    {loading && <Loader className='text-white mr-1' size={16} />}
    {children}
  </button>
)

export const ButtonSecondary: FC<ButtonProps> = ({
  children,
  className,
  loading,
  ...props
}) => (
  <button
    className={twsx(
      'border-blue-600 text-blue-600 bg-white',
      'hover:bg-blue-200 hover:text-blue-700',
      'disabled:border-gray-600 disabled:text-gray-600 disabled:bg-transparent',
      commonStyles,
      className
    )}
    {...props}
  >
    {loading && (
      <Loader className='text-blue-600 disabled:text-gray-600 mr-1' size={16} />
    )}
    {children}
  </button>
)

export const ButtonTertiary: FC<ButtonProps> = ({
  children,
  className,
  loading,
  ...props
}) => (
  <button
    className={twsx(
      'border-transparent text-gray-600',
      'hover:bg-gray-200 hover:text-gray-700',
      commonStyles,
      className
    )}
    {...props}
  >
    {loading && <Loader className='text-gray-600 mr-1' size={16} />}
    {children}
  </button>
)
