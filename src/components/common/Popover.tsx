import { twsx } from '../../utils/dom'
import {
  useFloating,
  offset,
  UseFloatingOptions,
  autoUpdate,
} from '@floating-ui/react-dom'
import { Transition } from '@headlessui/react'
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type PopoverContext = {
  show: boolean
  referenceElement: HTMLDivElement | null
  setReferenceElement: Dispatch<SetStateAction<HTMLDivElement | null>>
  options?: Partial<UseFloatingOptions>
}

const PopoverContext = createContext<PopoverContext>({
  show: false,
  referenceElement: null,
  setReferenceElement: () => {
    throw new Error('Must use within a PopoverContext provider')
  },
  options: {},
})

const PopoverParent: FC<
  PropsWithChildren<{ show: boolean; options?: Partial<UseFloatingOptions> }>
> = ({ show, options, children }) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null)

  const value: PopoverContext = useMemo(
    () => ({ show, referenceElement, setReferenceElement, options }),
    [options, referenceElement, show],
  )

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  )
}

const PopoverTarget: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  const { setReferenceElement } = useContext(PopoverContext)

  return (
    <div className={className} ref={setReferenceElement}>
      {children}
    </div>
  )
}

const PopoverContent: FC<
  PropsWithChildren<{
    className?: string
    onClickOutside?: () => void
  }>
> = ({ children, className, onClickOutside }) => {
  const { show, referenceElement, options } = useContext(PopoverContext)
  const [floatingElement, setFloatingElement] = useState<HTMLElement | null>(
    null,
  )

  const { x, y, strategy } = useFloating({
    placement: options?.placement ?? 'bottom',
    strategy: options?.strategy ?? 'absolute',
    middleware: options?.middleware ?? [offset(6)],
    whileElementsMounted: autoUpdate,
    elements: {
      reference: referenceElement,
      floating: floatingElement,
    },
  })

  useEffect(() => {
    if (!onClickOutside) return

    const listener = (e: MouseEvent) => {
      const target = e.target

      if (!floatingElement) return
      if (!(target instanceof Node)) return

      if (!floatingElement.contains(target)) {
        onClickOutside()
      }
    }

    document.addEventListener('click', listener)
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [floatingElement, onClickOutside])

  return (
    <Transition
      show={show}
      enter='transition-opacity'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-opacity'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
      ref={setFloatingElement}
      style={{ position: strategy, top: y ?? '', left: x ?? '' }}
      className={twsx('z-10', className)}
    >
      {children}
    </Transition>
  )
}

const Wrapper = PopoverParent as unknown as typeof PopoverParent & {
  Target: typeof PopoverTarget
  Content: typeof PopoverContent
}
Wrapper.Target = PopoverTarget
Wrapper.Content = PopoverContent

export default Wrapper
