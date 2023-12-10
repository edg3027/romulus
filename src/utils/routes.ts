import { useSearchParams } from 'next/navigation'
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
  const params = useSearchParams()

  return useMemo(() => {
    const rawValue = params?.get(param) ?? undefined
    return processor(rawValue)
  }, [param, params, processor])
}

export const useStringRouteParam = (param: string): string | undefined =>
  useRouteParam(param, (value) => (Array.isArray(value) ? value[0] : value))

export const toValidInt = (
  val: string | null | undefined
): number | undefined => {
  if (val === null || val === undefined) return undefined

  const intValue = Number.parseInt(val)
  return Number.isNaN(intValue) ? undefined : intValue
}

export const useIntParam = (stringValue: string): number | undefined => {
  return useMemo(() => toValidInt(stringValue), [stringValue])
}

export const useIntRouteParam = (param: string): number | undefined => {
  const stringValue = useStringRouteParam(param)
  return useIntParam(stringValue)
}

export const useBoolRouteParam = (param: string): boolean | undefined => {
  const stringValue = useStringRouteParam(param)
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
