import useDebouncedState from '../../hooks/useDebouncedState'
import { isBrowser } from '../../utils/dom'
import { Transition } from '@headlessui/react'
import {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'

const Tooltip: FC<
  PropsWithChildren<{ className?: string; tip: ReactNode; delay?: number }>
> = ({ className, tip, children, delay = 500 }) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null)
  const ref = useRef(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)

  const { styles, attributes } = usePopper(referenceElement, ref.current, {
    modifiers: [
      {
        name: 'arrow',
        options: { element: arrowElement },
      },
      { name: 'offset', options: { offset: [0, 6] } },
    ],
  })

  const [show, setShow] = useState(false)
  const [showDebounced] = useDebouncedState(show, delay)

  useEffect(() => {
    if (!referenceElement) return

    const onEnterListener = () => setShow(true)
    const onExitListener = () => setShow(false)

    referenceElement.addEventListener('mouseenter', onEnterListener)
    referenceElement.addEventListener('mouseleave', onExitListener)

    return () => {
      referenceElement.removeEventListener('mouseenter', onEnterListener)
      referenceElement.removeEventListener('mouseleave', onExitListener)
    }
  }, [referenceElement])

  return (
    <div className={className} ref={setReferenceElement}>
      {children}
      {isBrowser
        ? createPortal(
            <Transition
              show={showDebounced}
              enter='transition-opacity'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
              className='tooltip rounded bg-gray-900 px-1.5 py-1 text-xs font-medium text-gray-100 shadow'
              ref={ref}
              style={styles.popper}
              {...attributes.popper}
            >
              {tip}
              <div
                className='arrow h-1 w-1 before:absolute before:h-1 before:w-1 before:rotate-45 before:bg-gray-900'
                ref={setArrowElement}
                style={styles.arrow}
              />
            </Transition>,
            document.body,
          )
        : null}
    </div>
  )
}

export default Tooltip
