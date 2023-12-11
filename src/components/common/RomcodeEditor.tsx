import { twsx } from '../../utils/dom'
import Romcode from './Romcode'
import clsx from 'clsx'
import {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  useState,
} from 'react'

enum Tab {
  EDIT,
  VIEW,
}

const RomcodeEditor = forwardRef<
  HTMLTextAreaElement,
  {
    id?: string
    value: string
    onChange: ChangeEventHandler<HTMLTextAreaElement>
    onBlur: FocusEventHandler<HTMLTextAreaElement>
    className?: string
  }
>(({ id, value, onChange, onBlur, className }, ref) => {
  const [tab, setTab] = useState<Tab>(Tab.EDIT)

  return (
    <div
      className={twsx(
        'group flex h-72 resize-y flex-col overflow-auto rounded border border-gray-500 bg-gray-100 text-sm text-gray-800 transition focus-within:border-secondary-500 hover:bg-gray-200 active:bg-gray-300',
        className,
      )}
    >
      {tab === Tab.EDIT && (
        <textarea
          ref={ref}
          id={id}
          className='flex-1 resize-none bg-transparent p-1.5 focus:outline-none'
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          style={{ flex: 1, resize: 'none' }}
        />
      )}
      {tab === Tab.VIEW && (
        <div className='flex-1 overflow-auto px-2 py-1'>
          <Romcode>{value}</Romcode>
        </div>
      )}
      <div className='flex border-t border-gray-200 transition group-hover:border-gray-300 group-active:border-gray-400'>
        <button
          className={clsx(
            'border-r border-gray-200 px-2 py-1 text-xs uppercase text-gray-400 transition hover:bg-gray-100 group-hover:border-gray-300 group-hover:text-gray-500 group-active:border-gray-400 group-active:text-gray-600',
            tab === Tab.EDIT ? 'font-bold' : 'font-medium',
          )}
          type='button'
          onClick={() => setTab(Tab.EDIT)}
        >
          Edit
        </button>
        <button
          className={clsx(
            'border-r border-gray-200 px-2 py-1 text-xs uppercase text-gray-400 transition hover:bg-gray-100 group-hover:border-gray-300 group-hover:text-gray-500 group-active:border-gray-400 group-active:text-gray-600',
            tab === Tab.VIEW ? 'font-bold' : 'font-medium',
          )}
          type='button'
          onClick={() => setTab(Tab.VIEW)}
        >
          View
        </button>
      </div>
    </div>
  )
})

RomcodeEditor.displayName = 'RomcodeEditor'

export default RomcodeEditor
