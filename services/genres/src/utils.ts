export const median = (arr: number[]): number => {
  if (arr.length === 0) return NaN

  const sorted = arr.slice().sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1]! + sorted[middle]!) / 2
  }

  return sorted[middle]!
}

export type MaybePromise<T> = T | Promise<T>
