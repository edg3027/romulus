import { Permission } from '@prisma/client'
import Link from 'next/link'
import { FC, useCallback, useState } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'

import useDebounce from '../../../hooks/useDebounce'
import { useSession } from '../../../services/auth'
import Button from '../../common/Button'
import IconButton from '../../common/IconButton'
import Input from '../../common/Input'
import GenreSearchResults from './Search'
import GenreNavigatorSettings from './Settings'
import GenreTree from './Tree'

const GenreNavigator: FC = () => {
  const session = useSession()

  const [showSettings, setShowSettings] = useState(false)
  const [filter, setFilter] = useState('')
  const [debouncedFilter, setDebouncedFilter] = useDebounce(filter, 200)

  const clearFilter = useCallback(() => {
    setFilter('')
    setDebouncedFilter('')
  }, [setDebouncedFilter])

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='flex space-x-1 border-b p-4'>
        <div className='relative flex-1'>
          <Input
            value={filter}
            onChange={setFilter}
            placeholder='Filter...'
            showClear
          />
        </div>
        <div className='flex h-full items-center'>
          <IconButton
            title='Settings'
            onClick={() => setShowSettings(!showSettings)}
          >
            <RiSettings3Fill />
          </IconButton>
        </div>
      </div>
      {showSettings && (
        <div className='border-b p-4'>
          <GenreNavigatorSettings />
        </div>
      )}
      {debouncedFilter && (
        <div className='flex justify-center border-b'>
          <Button
            template='tertiary'
            className='w-full'
            onClick={() => clearFilter()}
          >
            Back to Tree
          </Button>
        </div>
      )}
      <div className='flex-1 overflow-auto'>
        {debouncedFilter ? (
          <GenreSearchResults
            filter={debouncedFilter}
            clearFilter={clearFilter}
          />
        ) : (
          <GenreTree />
        )}
      </div>
      {session.isLoggedIn && session.hasPermission(Permission.EDIT_GENRES) && (
        <div className='border-t p-1'>
          <Link href={{ pathname: '/genres', query: { view: 'create' } }}>
            <a className='w-full'>
              <Button template='secondary' className='w-full'>
                New Genre
              </Button>
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default GenreNavigator
