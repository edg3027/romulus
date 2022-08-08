import Link from 'next/link'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { DefaultGenre } from '../../server/db/genre'
import { useSession } from '../../services/auth'

const GenreViewData: FC<{ genre: DefaultGenre }> = ({ genre }) => {
  const session = useSession()

  return (
    <div className='flex-1 overflow-auto p-4'>
      <div className='text-lg font-bold text-gray-600 mb-4'>{genre.name}</div>

      <div className='space-y-3'>
        {genre.akas.length > 0 && (
          <div>
            <label className='block text-gray-500 text-sm' htmlFor='akas'>
              AKA
            </label>
            <div id='akas'>{genre.akas.join(', ')}</div>
          </div>
        )}

        {genre.influencedByGenres.length > 0 && (
          <div>
            <label className='block text-gray-500 text-sm' htmlFor='influences'>
              Influences
            </label>
            <ul id='influences' className='comma-list'>
              {genre.influencedByGenres.map(({ id, name }) => (
                <li key={id}>
                  <Link
                    href={{
                      pathname: '/genres/[id]',
                      query: { id: id.toString() },
                    }}
                  >
                    <a className='text-blue-500 hover:underline'>{name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label
            className='block text-gray-500 text-sm'
            htmlFor='short-description'
          >
            Short Description
          </label>
          <div id='short-description'>
            {genre.shortDescription ? (
              <ReactMarkdown className='prose prose-gray'>
                {genre.shortDescription}
              </ReactMarkdown>
            ) : (
              <span>
                Missing a short description.{' '}
                {session.isLoggedIn && (
                  <Link
                    href={{
                      pathname: '/genres/[id]/edit',
                      query: {
                        id: genre.id.toString(),
                        autoFocus: 'shortDescription',
                      },
                    }}
                  >
                    <a className='text-blue-500 hover:underline'>Add one.</a>
                  </Link>
                )}
              </span>
            )}
          </div>
        </div>

        <div>
          <label
            className='block text-gray-500 text-sm'
            htmlFor='long-description'
          >
            Long Description
          </label>
          <div id='long-description'>
            {genre.longDescription ? (
              <ReactMarkdown className='prose prose-gray'>
                {genre.longDescription}
              </ReactMarkdown>
            ) : (
              <span>
                Missing a long description.{' '}
                {session.isLoggedIn && (
                  <Link
                    href={{
                      pathname: '/genres/[id]/edit',
                      query: {
                        id: genre.id.toString(),
                        autoFocus: 'longDescription',
                      },
                    }}
                  >
                    <a className='text-blue-500 hover:underline'>Add one.</a>
                  </Link>
                )}
              </span>
            )}
          </div>
        </div>

        {genre.notes && (
          <div>
            <label className='block text-gray-500 text-sm' htmlFor='notes'>
              Notes
            </label>
            <div id='notes'>
              <ReactMarkdown className='prose prose-gray'>
                {genre.notes}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <div>
          <label className='block text-gray-500 text-sm' htmlFor='contributors'>
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