import useAccountSettings from '../../../../hooks/useAccountSettings'
import { isFullyVisible } from '../../../../utils/dom'
import IconButton from '../../../common/IconButton'
import GenreTypeChip from '../../GenreTypeChip'
import RelevanceChip from './RelevanceChip'
import { TreeGenre, useTreeState } from './state'
import { useGenreTreeRef } from './useGenreTreeRef'
import clsx from 'clsx'
import Link from 'next/link'
import { equals } from 'ramda'
import { FC, useEffect, useMemo, useState } from 'react'
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri'

const Wrapper: FC<{ id: number; path: number[] }> = ({ id, path }) => {
  const genre = useTreeState((state) => state.genres.get(id))

  if (!genre) return null

  return <GenreTreeNode genre={genre} path={path} />
}

const GenreTreeNode: FC<{ genre: TreeGenre; path: number[] }> = ({
  genre,
  path,
}) => {
  const { id, children, parents, name, subtitle, relevance } = genre

  const setExpanded = useTreeState((state) => state.setExpanded)
  const isExpanded = useTreeState((state) => state.getExpanded(path))
  const isSelected = useTreeState(
    (state) => state.selectedPath && equals(state.selectedPath, path),
  )

  const { showTypeTags, showRelevanceTags } = useAccountSettings()
  const setSelectedId = useTreeState((state) => state.setSelectedId)
  const setSelectedPath = useTreeState((state) => state.setSelectedPath)

  const [ref, setRef] = useState<HTMLLIElement | null>(null)
  const treeRef = useGenreTreeRef()
  useEffect(() => {
    if (isSelected && ref && treeRef) {
      const visible = isFullyVisible(ref, treeRef)
      if (!visible) {
        ref.scrollIntoView()
      }
    }
  }, [isSelected, ref, treeRef])

  const genres = useTreeState((state) => state.genres)
  const sortedChildren = useMemo(() => {
    return [...children].sort((a, b) => {
      const genreA = genres.get(a)
      const genreB = genres.get(b)
      if (!genreA || !genreB) return 0
      return genreA.name.localeCompare(genreB.name)
    })
  }, [children, genres])

  return (
    <li
      ref={setRef}
      className={clsx(
        parents.length > 0 &&
          'ml-4 border-l border-gray-200 dark:border-gray-700',
      )}
    >
      <div className='ml-1 flex space-x-1'>
        <IconButton
          size='sm'
          className={clsx(
            'text-gray-500',
            children.length === 0 && 'invisible',
          )}
          onClick={() => setExpanded(path, !isExpanded)}
        >
          {isExpanded ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
        </IconButton>
        <Link
          href={`/genres?id=${id}`}
          onClick={() => {
            setSelectedId(id)
            setSelectedPath(path)
          }}
          className={clsx(
            'hover:font-bold',
            isSelected
              ? 'font-bold text-primary-600'
              : 'text-gray-600 dark:text-gray-300',
          )}
        >
          {name}
          {subtitle && (
            <>
              {' '}
              <span
                className={clsx(
                  'text-sm',
                  isSelected
                    ? 'text-primary-500 dark:text-primary-700'
                    : 'text-gray-500',
                )}
              >
                [{subtitle}]
              </span>
            </>
          )}
          {showTypeTags && genre.type !== 'STYLE' && (
            <>
              {' '}
              <GenreTypeChip type={genre.type} />
            </>
          )}
          {showRelevanceTags && (
            <>
              {' '}
              <RelevanceChip relevance={relevance} />
            </>
          )}
        </Link>
      </div>
      {isExpanded && children.length > 0 && (
        <ul>
          {sortedChildren.map((childId) => {
            const childPath = [...path, childId]
            return (
              <Wrapper
                key={childPath.join('-')}
                id={childId}
                path={childPath}
              />
            )
          })}
        </ul>
      )}
    </li>
  )
}

export default Wrapper
