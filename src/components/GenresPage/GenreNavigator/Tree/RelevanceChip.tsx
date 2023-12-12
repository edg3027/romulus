import { twsx } from '../../../../utils/dom'
import Chip from '../../../common/Chip'
import { FC } from 'react'

const RelevanceChip: FC<{ relevance: number; className?: string }> = ({
  relevance,
  className,
}) => {
  if (relevance === 99) {
    return (
      <Chip
        text='?'
        title='Missing Relevance'
        className={twsx(
          'bg-error-200 text-error-500 dark:bg-error-800 dark:bg-opacity-25 dark:text-error-600',
          className,
        )}
      />
    )
  }

  return <Chip text={relevance.toString()} className={className} />
}

export default RelevanceChip
