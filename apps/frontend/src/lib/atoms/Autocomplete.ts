import type { Snippet } from 'svelte'

export type AutocompleteProps<T, O extends AutocompleteOption<T> = AutocompleteOption<T>> = {
  value: string
  options: O[]
  id?: string
  placeholder?: string
  class?: string
  disabled?: boolean
  autofocus?: boolean
  errors?: string[]
  onInput?: (value: string) => void
  onSelect?: (option: O) => void
  option?: Snippet<[{ option: O }]>
}

export type AutocompleteOption<T> = { value: T; label: string }
