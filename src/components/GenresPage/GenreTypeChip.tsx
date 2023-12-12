import { GenreType } from '../../server/db/genre/outputs'
import { capitalize } from '../../utils/string'
import Chip from '../common/Chip'
import { FC, useMemo } from 'react'

const GenreTypeChip: FC<{ type: GenreType; className?: string }> = ({
  type,
  className,
}) => {
  const title = useMemo(() => capitalize(type), [type])

  const text = useMemo(
    () => (type === GenreType.MOVEMENT ? 'Mvmt' : capitalize(type)),
    [type],
  )

  return <Chip text={text} title={title} className={className} />
}

export default GenreTypeChip
