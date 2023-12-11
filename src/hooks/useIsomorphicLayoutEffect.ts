import { isBrowser } from '../utils/dom'
import { useEffect, useLayoutEffect } from 'react'

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
