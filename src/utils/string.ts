export const capitalize = (s: string): string =>
  s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()

export const toAscii = (str: string) =>
  str.normalize('NFD').replaceAll(/\p{Diacritic}/gu, '')

export function compareTwoStrings(first: string, second: string) {
  first = first.replaceAll(/\s+/g, '')
  second = second.replaceAll(/\s+/g, '')

  if (first === second) return 1 // identical or empty
  if (first.length < 2 || second.length < 2) return 0 // if either is a 0-letter or 1-letter string

  const firstBigrams = new Map<string, number>()
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.slice(i, i + 2)
    const count = (firstBigrams.get(bigram) ?? 0) + 1

    firstBigrams.set(bigram, count)
  }

  let intersectionSize = 0
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.slice(i, i + 2)
    const count = firstBigrams.get(bigram) ?? 0

    if (count > 0) {
      firstBigrams.set(bigram, count - 1)
      intersectionSize++
    }
  }

  return (2 * intersectionSize) / (first.length + second.length - 2)
}
