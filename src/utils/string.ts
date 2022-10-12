export const capitalize = (s: string): string =>
  s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()

export const toAscii = (str: string) =>
  str.normalize('NFD').replace(/\p{Diacritic}/gu, '')
