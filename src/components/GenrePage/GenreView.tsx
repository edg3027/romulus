import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

import { DefaultGenre } from '../../server/db/genre'
import { useSession } from '../../services/auth'
import {
  useDeleteGenreMutation,
  useEditGenreMutation,
  useGenreQuery,
} from '../../services/genres'
import GenreForm, { GenreFormData, GenreFormFields } from '../GenreForm'

export const GenreView: FC<{
  id?: number
}> = ({ id }) => (id === undefined ? <NoId /> : <HasId id={id} />)

const NoId: FC = () => (
  <div className='w-full h-full flex items-center justify-center text-gray-400'>
    Select a genre
  </div>
)

const HasId: FC<{ id: number }> = ({ id }) => {
  const genreQuery = useGenreQuery(id)

  if (genreQuery.data) {
    return <HasData genre={genreQuery.data} />
  }

  if (genreQuery.error) {
    return <div>Error fetching genre :(</div>
  }

  return <div>Loading...</div>
}

const HasData: FC<{ genre: DefaultGenre }> = ({ genre }) => {
  const session = useSession()
  const router = useRouter()

  const [viewState, setViewState] = useState<
    | { type: 'view' }
    | { type: 'edit'; autoFocus?: keyof GenreFormFields }
    | { type: 'delete' }
  >({ type: 'view' })

  const { mutate: deleteGenre } = useDeleteGenreMutation()
  const handleDelete = useCallback(() => {
    const message = `Deleted genre '${genre.name}'`

    deleteGenre(
      { id: genre.id },
      {
        onSuccess: () => {
          toast.success(message)
          router.push('/genres')
          setViewState({ type: 'view' })
        },
      }
    )
  }, [deleteGenre, genre.id, genre.name, router])

  const { mutate: editGenre } = useEditGenreMutation()
  const handleEdit = useCallback(
    (data: GenreFormData) =>
      editGenre(
        { id: genre.id, data },
        {
          onSuccess: (data) => {
            toast.success(`Updated genre '${data.name}'`)
            setViewState({ type: 'view' })
          },
        }
      ),
    [editGenre, genre.id]
  )

  return (
    <div className='flex flex-col h-full'>
      {viewState.type === 'edit' ? (
        <GenreForm
          genre={genre}
          onSubmit={(data) => handleEdit(data)}
          onClose={() => setViewState({ type: 'view' })}
          autoFocus={viewState.autoFocus}
        />
      ) : (
        <div className='flex-1 overflow-auto p-4'>
          <div className='text-lg font-bold text-gray-600 mb-4'>
            {genre.name}
          </div>
          <div className='space-y-3'>
            {genre.influencedByGenres.length > 0 && (
              <div>
                <label
                  className='block text-gray-700 text-sm'
                  htmlFor='influences'
                >
                  Influences
                </label>
                <ul id='influences' className='comma-list'>
                  {genre.influencedByGenres.map(({ id, name }) => (
                    <li key={id}>
                      <Link href={`/genres/${id}`}>
                        <a className='text-blue-500 hover:underline'>{name}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label
                className='block text-gray-700 text-sm'
                htmlFor='short-description'
              >
                Short Description
              </label>
              <div id='short-description'>
                {genre.shortDescription || (
                  <span>
                    Missing a short description.{' '}
                    {session.isLoggedIn && (
                      <button
                        className='text-blue-500 hover:underline'
                        onClick={() =>
                          setViewState({
                            type: 'edit',
                            autoFocus: 'shortDescription',
                          })
                        }
                      >
                        Add one.
                      </button>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                className='block text-gray-700 text-sm'
                htmlFor='long-description'
              >
                Long Description
              </label>
              <div id='long-description'>
                {genre.longDescription ? (
                  <div className='prose prose-gray'>
                    <ReactMarkdown>{genre.longDescription}</ReactMarkdown>
                  </div>
                ) : (
                  <span>
                    Missing a long description.{' '}
                    {session.isLoggedIn && (
                      <button
                        className='text-blue-500 hover:underline'
                        onClick={() =>
                          setViewState({
                            type: 'edit',
                            autoFocus: 'longDescription',
                          })
                        }
                      >
                        Add one.
                      </button>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                className='block text-gray-700 text-sm'
                htmlFor='contributors'
              >
                Contributors
              </label>
              <div id='contributors'>
                {genre.contributors.length > 0
                  ? genre.contributors
                      .map((contributor) => contributor.username)
                      .join(', ')
                  : 'No contributors'}
              </div>
            </div>
          </div>
        </div>
      )}

      {session.isLoggedIn && viewState.type === 'view' && (
        <div className='flex p-1 space-x-1 border-t'>
          <button
            className='flex-1 bg-blue-600 font-bold text-white rounded-sm p-1'
            onClick={() => setViewState({ type: 'edit' })}
          >
            Edit
          </button>
          <button
            className='flex-1 bg-gray-200 font-bold text-gray-700 rounded-sm p-1'
            onClick={() => setViewState({ type: 'delete' })}
          >
            Delete
          </button>
        </div>
      )}
      {session.isLoggedIn && viewState.type === 'delete' && (
        <div className='border-t'>
          <div className='flex justify-center mt-1 text-gray-800'>
            Are you sure?
          </div>
          <div className='flex p-1 space-x-1'>
            <button
              className='flex-1 bg-red-600 font-bold text-white rounded-sm p-1'
              onClick={() => handleDelete()}
            >
              Delete
            </button>
            <button
              className='flex-1 bg-gray-200 font-bold text-gray-700 rounded-sm p-1'
              onClick={() => setViewState({ type: 'view' })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GenreView
