import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const toQueryString = (
  params:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined
): string => new URLSearchParams(params).toString()

export const fromQueryString = (qs: string): URLSearchParams =>
  new URLSearchParams(qs)

const useRouteParam = <T>(
  param: string,
  processor: (value: string | string[] | undefined) => T
): T => {
  const router = useRouter()

  return useMemo(() => {
    const rawValue = router.query[param]
    return processor(rawValue)
  }, [param, processor, router.query])
}

export const useStringRouteParam = (param: string): string | undefined =>
  useRouteParam(param, (value) => (Array.isArray(value) ? value[0] : value))

export const useStringAppRouteParam = (param: string): string | undefined => {
  const searchParams = useSearchParams()

  return useMemo(
    () => searchParams?.get(param) ?? undefined,
    [param, searchParams]
  )
}

export const toValidInt = (
  val: string | null | undefined
): number | undefined => {
  if (val === null || val === undefined) return undefined

  const intValue = Number.parseInt(val)
  return Number.isNaN(intValue) ? undefined : intValue
}

export const useIntRouteParam = (param: string): number | undefined => {
  const stringValue = useStringRouteParam(param)
  return useMemo(() => toValidInt(stringValue), [stringValue])
}

export const useIntAppRouteParam = (param: string): number | undefined => {
  const stringValue = useStringAppRouteParam(param)
  return useMemo(() => toValidInt(stringValue), [stringValue])
}

export const useBoolRouteParam = (param: string): boolean | undefined => {
  const stringValue = useStringRouteParam(param)
  return useMemo(
    () => (stringValue !== undefined ? stringValue === 'true' : undefined),
    [stringValue]
  )
}

export const useBoolAppRouteParam = (param: string): boolean | undefined => {
  const stringValue = useStringAppRouteParam(param)
  return useMemo(
    () => (stringValue !== undefined ? stringValue === 'true' : undefined),
    [stringValue]
  )
}

export const useCustomRouteParam = <T>(
  param: string,
  validator: (value: string) => value is string & T
): T | undefined => {
  const stringValue = useStringRouteParam(param)

  return useMemo(
    () =>
      stringValue !== undefined && validator(stringValue)
        ? stringValue
        : undefined,
    [stringValue, validator]
  )
}

export const useCustomAppRouteParam = <T>(
  param: string,
  validator: (value: string) => value is string & T
): T | undefined => {
  const stringValue = useStringAppRouteParam(param)

  return useMemo(
    () =>
      stringValue !== undefined && validator(stringValue)
        ? stringValue
        : undefined,
    [stringValue, validator]
  )
}
