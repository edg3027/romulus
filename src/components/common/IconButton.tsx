import { twsx } from '../../utils/dom'
import Loader from './Loader'
import {
  ButtonHTMLAttributes,
  Children,
  cloneElement,
  FC,
  ReactElement,
  useMemo,
} from 'react'
import { IconBaseProps } from 'react-icons'

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  children: ReactElement<IconBaseProps>
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const IconButton: FC<IconButtonProps> = ({
  children,
  size = 'md',
  loading,
  className,
  disabled,
  ...props
}) => {
  const iconSize = useMemo(() => {
    switch (size) {
      case 'sm': {
        return 16
      }
      case 'md': {
        return 18
      }
      case 'lg': {
        return 24
      }
    }
  }, [size])

  const icon = useMemo(
    () =>
      Children.map(children, (child) =>
        cloneElement(child, { size: iconSize }),
      ),
    [children, iconSize],
  )

  return (
    <button
      className={twsx(
        'rounded border border-transparent bg-transparent p-1 text-primary-500 outline-none transition hover:bg-gray-200 focus:border-secondary-500 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500',
        disabled && 'pointer-events-none text-gray-400 dark:text-gray-500',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {loading ? <Loader className='text-inherit' size={iconSize} /> : icon}
    </button>
  )
}

export default IconButton
