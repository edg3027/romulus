import type { NextPage } from 'next'
import Link from 'next/link'
import { useCallback, useState } from 'react'

import CreateGenreDialog from '../../components/CreateGenreDialog'
import EditGenreDialog from '../../components/EditGenreDialog'
import { GenreFormFields } from '../../components/GenreForm'
import GenreTree from '../../components/GenreTree'
import ViewGenre from '../../components/ViewGenre'
import { useSession } from '../../services/auth'
import { useGenresQuery } from '../../services/genres'

type DialogState =
  | { type: 'edit'; id: number; autoFocus?: keyof GenreFormFields }
  | { type: 'create' }

const Genres: NextPage = () => {
  const session = useSession()

  const [viewingGenreId, setViewingGenreId] = useState<number>()
  const [dialogState, setDialogState] = useState<DialogState>()

  const genresQuery = useGenresQuery()

  const renderGenreTree = useCallback(() => {
    if (genresQuery.data) {
      return (
        <div className='w-full h-full flex flex-col'>
          <div className='flex-1 p-4'>
            <GenreTree
              genres={genresQuery.data}
              onClickGenre={(id) => setViewingGenreId(id)}
              selectedId={viewingGenreId}
            />
          </div>
          {session.isLoggedIn && (
            <button
              className='border-t text-gray-400 font-bold p-1 hover:bg-gray-100 hover:text-gray-500'
              onClick={() => setDialogState({ type: 'create' })}
            >
              New Genre
            </button>
          )}
        </div>
      )
    }

    if (genresQuery.error) {
      return (
        <div className='w-full h-full flex items-center justify-center text-red-600'>
          Error fetching genres :(
        </div>
      )
    }

    return (
      <div className='w-full h-full flex items-center justify-center text-gray-400'>
        Loading...
      </div>
    )
  }, [genresQuery.data, genresQuery.error, session.isLoggedIn, viewingGenreId])

  const renderViewGenre = useCallback(() => {
    if (viewingGenreId === undefined) {
      return (
        <div className='w-full h-full flex items-center justify-center text-gray-400'>
          Select a genre
        </div>
      )
    }

    return (
      <div className='w-full h-full flex flex-col'>
        <div className='flex-1 p-4'>
          <ViewGenre
            id={viewingGenreId}
            onEditGenre={(id, autoFocus) =>
              setDialogState({ type: 'edit', id, autoFocus })
            }
          />
        </div>
        {session.isLoggedIn && (
          <button
            className='border-t text-gray-400 font-bold p-1 hover:bg-gray-100 hover:text-gray-500'
            onClick={() => setDialogState({ type: 'edit', id: viewingGenreId })}
          >
            Edit
          </button>
        )}
      </div>
    )
  }, [session.isLoggedIn, viewingGenreId])

  return (
    <>
      <div className='bg-texture w-full h-full flex items-center'>
        <div className='w-full flex flex-col items-center'>
          <div className='flex justify-center space-x-4'>
            <div className='w-[500px] h-[500px] border bg-white shadow-sm '>
              {renderGenreTree()}
            </div>
            <div className='w-[500px] h-[500px] border bg-white shadow-sm'>
              {renderViewGenre()}
            </div>
          </div>

          {session.isLoggedOut && (
            <div className='mt-6 text-gray-700'>
              <Link href='/login'>
                <a className='text-blue-500 hover:underline'>Log in</a>
              </Link>{' '}
              to create and edit genres.
            </div>
          )}
        </div>
      </div>

      {dialogState && dialogState.type === 'create' && (
        <CreateGenreDialog onClose={() => setDialogState(undefined)} />
      )}
      {dialogState && dialogState.type === 'edit' && (
        <EditGenreDialog
          id={dialogState.id}
          onClose={() => setDialogState(undefined)}
          autoFocus={dialogState.autoFocus}
        />
      )}
    </>
  )
}

export default Genres