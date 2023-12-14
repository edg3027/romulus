import { SimpleGenre } from '../../../../server/db/genre/outputs'
import { useSession } from '../../../../services/auth'
import { useSimpleGenresQuery } from '../../../../services/genres'
import Button from '../../../common/Button'
import { CenteredLoader } from '../../../common/Loader'
import GenreTreeNode from './TreeNode'
import { TreeGenre, useTreeState } from './state'
import { GenreTreeRefProvider } from './useGenreTreeRef'
import { Permission } from '@prisma/client'
import Link from 'next/link'
import { FC, useEffect, useMemo, useState } from 'react'

const GenreTree: FC = () => {
  const genres = useSimpleGenresQuery()

  if (genres.data) {
    return <Tree genres={genres.data} />
  }

  if (genres.error) {
    return (
      <div className='flex h-full w-full items-center justify-center text-error-600'>
        Error fetching genres :(
      </div>
    )
  }

  return <CenteredLoader />
}

const Tree: FC<{ genres: SimpleGenre[] }> = ({ genres }) => {
  const session = useSession()
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  const isAnyTopLevelExpanded = useTreeState((state) =>
    [...state.expanded].some((key) => !key.includes('-')),
  )

  const collapseAll = useTreeState((state) => state.collapseAll)

  const genresMap = useMemo(() => {
    const map = new Map<number, TreeGenre>(
      genres.map(({ parentGenres, ...genre }) => [
        genre.id,
        { ...genre, parents: parentGenres.map((pg) => pg.id), children: [] },
      ]),
    )

    for (const genre of genres) {
      for (const parent of genre.parentGenres) {
        const parentGenre = map.get(parent.id)
        if (parentGenre) {
          parentGenre.children.push(genre.id)
        }
      }
    }

    return map
  }, [genres])

  const topLevelGenres = useMemo(
    () =>
      genres
        .filter((genre) => genre.parentGenres.length === 0)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [genres],
  )

  const setGenres = useTreeState((state) => state.setGenres)
  useEffect(() => setGenres(genresMap), [genresMap, setGenres])

  return (
    <GenreTreeRefProvider treeEl={ref}>
      <div className='flex h-full w-full flex-col'>
        {topLevelGenres.length > 0 ? (
          <div ref={setRef} className='flex-1 overflow-auto p-4 pl-1'>
            <ul>
              {topLevelGenres.map((genre) => (
                <GenreTreeNode key={genre.id} id={genre.id} path={[genre.id]} />
              ))}
            </ul>
          </div>
        ) : (
          <div className='flex w-full flex-1 flex-col items-center justify-center text-gray-400'>
            <div>No genres found.</div>
            {session.isLoggedIn &&
              session.hasPermission(Permission.EDIT_GENRES) && (
                <div>
                  <Link
                    href='/genres?view=create'
                    className='text-primary-500 hover:underline'
                  >
                    Create one.
                  </Link>
                </div>
              )}
          </div>
        )}
        {isAnyTopLevelExpanded && (
          <div className='w-full p-1'>
            <Button
              className='w-full'
              template='tertiary'
              onClick={() => collapseAll()}
            >
              Collapse All
            </Button>
          </div>
        )}
      </div>
    </GenreTreeRefProvider>
  )
}

export default GenreTree
