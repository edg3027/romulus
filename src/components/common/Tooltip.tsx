import useDebouncedState from '../../hooks/useDebouncedState'
import { isBrowser } from '../../utils/dom'
import { useFloating, arrow, offset } from '@floating-ui/react-dom'
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

const Tooltip: FC<
  PropsWithChildren<{ className?: string; tip: ReactNode; delay?: number }>
> = ({ className, tip, children, delay = 500 }) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null)
  const [floatingElement, setFloatingElement] = useState<HTMLElement | null>(
    null,
  )
  const arrowElement = useRef(null)

  const { x, y, strategy, middlewareData, update } = useFloating({
    placement: 'top',
    middleware: [arrow({ element: arrowElement.current }), offset(6)],
    elements: {
      reference: referenceElement,
      floating: floatingElement,
    },
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

  useEffect(() => {
    update()
  }, [showDebounced, update])

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
              className='tooltip rounded bg-gray-900 px-1.5 py-1 text-xs font-medium text-gray-100 shadow dark:bg-gray-100 dark:text-gray-800'
              ref={setFloatingElement}
              style={{ position: strategy, top: y ?? '', left: x ?? '' }}
            >
              {tip}
              <div
                className='arrow h-1 w-1 before:absolute before:h-1 before:w-1 before:rotate-45 before:bg-gray-900 dark:before:bg-gray-100'
                ref={arrowElement}
                style={{
                  position: 'absolute',
                  left:
                    middlewareData.arrow?.x == null
                      ? ''
                      : `${middlewareData.arrow.x}px`,
                  top:
                    middlewareData.arrow?.y == null
                      ? ''
                      : `${middlewareData.arrow.y}px`,
                }}
              />
            </Transition>,
            document.body,
          )
        : null}
    </div>
  )
}

export default Tooltip
