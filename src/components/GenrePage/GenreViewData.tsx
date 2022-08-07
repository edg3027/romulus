import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { DefaultGenre } from '../../server/db/genre'
import { useSession } from '../../services/auth'

const GenreViewData: FC<{ genre: DefaultGenre }> = ({ genre }) => {
  const session = useSession()
  const router = useRouter()

  return (
    <div className='flex-1 overflow-auto p-4'>
      <div className='text-lg font-bold text-gray-600 mb-4'>{genre.name}</div>
      <div className='space-y-3'>
        {genre.influencedByGenres.length > 0 && (
          <div>
            <label className='block text-gray-700 text-sm' htmlFor='influences'>
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
                    onClick={() => router.push(`/genres/${genre.id}/edit`)}
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
                    onClick={() => router.push(`/genres/${genre.id}/edit`)}
                  >
                    Add one.
                  </button>
                )}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className='block text-gray-700 text-sm' htmlFor='contributors'>
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
  )
}

export default GenreViewData
