import { HasId, useMultiselectContext } from './context'
import clsx from 'clsx'
import { PropsWithChildren } from 'react'
import { RiCloseFill } from 'react-icons/ri'

export type MultiselecteSelectedProps<T> = {
  item: T
}

const MultiselectSelected = <T extends HasId>({
  item,
  children,
}: PropsWithChildren<MultiselecteSelectedProps<T>>) => {
  const { unselect } = useMultiselectContext()

  return (
    <button
      type='button'
      className={clsx(
        'group flex items-center whitespace-nowrap rounded-full border border-gray-400 bg-gray-200 py-0.5 pl-2 pr-1 text-xs font-medium text-gray-600',
        'hover:border-error-700 hover:bg-error-300 hover:text-error-800 dark:bg-gray-600 dark:text-gray-400 dark:hover:border-error-300 dark:hover:bg-error-500 dark:hover:bg-opacity-25 dark:hover:text-error-300',
      )}
      onClick={(e) => {
        unselect(item)
        e.stopPropagation()
      }}
    >
      <span>{children}</span>
      <RiCloseFill
        size={12}
        className='ml-1 text-gray-500 group-hover:text-error-700 dark:text-gray-400 dark:group-hover:text-error-300'
      />
    </button>
  )
}

export default MultiselectSelected
