import Input from '../../common/Input'
import { useSearchState } from './search-state'
import { FC } from 'react'

const SearchInput: FC = () => {
  const filter = useSearchState((state) => state.filter)
  const setFilter = useSearchState((state) => state.setFilter)
  const setFilterImmediately = useSearchState(
    (state) => state.setFilterImmediately,
  )

  return (
    <Input
      value={filter}
      onChange={setFilter}
      placeholder='Filter...'
      showClear
      onClear={() => {
        setFilterImmediately('')
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setFilterImmediately(e.currentTarget.value)
        }
      }}
    />
  )
}

export default SearchInput
