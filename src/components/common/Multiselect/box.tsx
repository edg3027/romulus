import Popover from '../Popover'
import { useMultiselectContext } from './context'
import clsx from 'clsx'
import { useMemo } from 'react'
import { FC, PropsWithChildren } from 'react'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'

const MultiselectBox: FC<PropsWithChildren> = ({ children }) => {
  const { open, setOpen, inputRef } = useMultiselectContext()

  const icon = useMemo(() => (open ? RiArrowUpSLine : RiArrowDownSLine), [open])

  return (
    <Popover.Target className='flex-1'>
      <div
        className={clsx(
          'flex h-8 w-full items-center rounded border border-gray-500 bg-gray-200 text-start text-sm text-gray-900 outline-none transition',
          'focus-within:border-secondary-500 hover:bg-gray-300 active:bg-gray-400 disabled:pointer-events-none disabled:border-dashed',
          'dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600',
        )}
        onClick={() => {
          setOpen(!open)
          inputRef?.focus()
        }}
      >
        <div className='flex flex-1 items-center space-x-1 p-1.5 pr-0'>
          {children}
        </div>
        <div className='flex h-full shrink-0 cursor-pointer items-center p-1.5 text-primary-500 dark:text-primary-400'>
          {icon({ size: 18 })}
        </div>
      </div>
    </Popover.Target>
  )
}

export default MultiselectBox
