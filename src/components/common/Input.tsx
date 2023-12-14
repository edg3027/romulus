import { twsx } from '../../utils/dom'
import { useInputGroupContext } from './InputGroup'
import Tooltip from './Tooltip'
import { forwardRef, InputHTMLAttributes, useMemo } from 'react'
import { RiCloseFill, RiErrorWarningLine } from 'react-icons/ri'

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> & {
  error?: unknown
  value?: string
  onChange?: (value: string) => void
  showClear?: boolean
  onClear?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: propsId,
      className,
      showClear = false,
      value,
      onChange,
      onClear,
      error: propsError,
      ...props
    },
    ref,
  ) => {
    const { id: contextId, error: contextError } = useInputGroupContext()
    const id = useMemo(() => propsId || contextId, [contextId, propsId])
    const error = useMemo(
      () => propsError || contextError,
      [contextError, propsError],
    )

    const isClearVisible = useMemo(
      () => !!(showClear && value?.length),
      [showClear, value?.length],
    )

    return (
      <div className={twsx('relative', className)}>
        <>
          <input
            ref={ref}
            id={id}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={twsx(
              'h-8 w-full rounded border border-gray-500 bg-gray-200 p-1.5 text-sm leading-3 text-gray-900 outline-none transition',
              'placeholder:italic placeholder:text-gray-600 hover:bg-gray-300 focus:border-secondary-500 active:bg-gray-400',
              'disabled:pointer-events-none disabled:border-dashed',
              'dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-600',
              isClearVisible && 'pr-7',
            )}
            {...props}
          />

          {(isClearVisible || error) && (
            <div className='absolute right-1.5 top-0 flex h-full items-center space-x-0.5'>
              <>
                {isClearVisible && (
                  <Tooltip tip='Clear' className='flex items-center'>
                    <button
                      className='rounded-full p-1 text-gray-500 transition hover:bg-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                      onClick={() => {
                        onChange?.('')
                        onClear?.()
                      }}
                    >
                      <RiCloseFill />
                    </button>
                  </Tooltip>
                )}
                {error && (
                  <RiErrorWarningLine className='text-error-500' size={18} />
                )}
              </>
            </div>
          )}
        </>
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
