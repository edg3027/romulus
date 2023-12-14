import { DefaultAccount } from '../../server/db/account/outputs'
import { useAccountQuery } from '../../services/accounts'
import { useGenreHistoryCountByUserQuery } from '../../services/genre-history'
import { CenteredLoader } from '../common/Loader'
import AccountGenreHistory from './AccountGenreHistory'
import { CrudOperation } from '@prisma/client'
import { FC } from 'react'

const AccountPage: FC<{ id: number }> = ({ id }) => {
  const accountQuery = useAccountQuery(id)

  if (accountQuery.data) {
    return (
      <div className='h-full w-full p-2 pt-0'>
        <div className='h-full rounded-lg border border-gray-200 bg-gray-100 p-4'>
          <HasData account={accountQuery.data} />
        </div>
      </div>
    )
  }

  if (accountQuery.error) {
    return <div>Error fetching account :(</div>
  }

  return <CenteredLoader />
}

const HasData: FC<{
  account: DefaultAccount
}> = ({ account }) => {
  const createdCountQuery = useGenreHistoryCountByUserQuery(
    account.id,
    CrudOperation.CREATE,
  )
  const editedCountQuery = useGenreHistoryCountByUserQuery(
    account.id,
    CrudOperation.UPDATE,
  )
  const deletedCountQuery = useGenreHistoryCountByUserQuery(
    account.id,
    CrudOperation.DELETE,
  )

  return (
    <div className='flex h-full max-h-full min-h-0 flex-col'>
      <div className='text-xl font-bold'>{account.username}</div>

      <div className='py-2'>
        <div>
          Genres created: {createdCountQuery.data?.count ?? 'Loading...'}
        </div>
        <div>Genres edited: {editedCountQuery.data?.count ?? 'Loading...'}</div>
        <div>
          Genres deleted: {deletedCountQuery.data?.count ?? 'Loading...'}
        </div>
      </div>

      <div className='min-h-0 flex-1 overflow-auto'>
        <AccountGenreHistory id={account.id} />
      </div>
    </div>
  )
}

export default AccountPage
