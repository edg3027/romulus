import { HasId, useMultiselectContext } from './context'
import clsx from 'clsx'
import { PropsWithChildren, useCallback } from 'react'

export type MultiselectOptionProps<T> = {
  item: T
}

const MultiselectOption = <T extends HasId>({
  children,
  item,
}: PropsWithChildren<MultiselectOptionProps<T>>) => {
  const { select, onQueryChange } = useMultiselectContext()

  const handleClick = useCallback(() => {
    select(item)
    onQueryChange('')
  }, [item, onQueryChange, select])

  return (
    <li
      className={clsx(
        'select-option cursor-pointer rounded border border-transparent p-1 px-1.5 text-sm text-gray-800',
        'hover:bg-gray-200 focus:border-secondary-500 active:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600',
      )}
      onClick={() => handleClick()}
    >
      {children}
    </li>
  )
}

export default MultiselectOption
