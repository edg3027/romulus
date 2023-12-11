'use client'

import AccountPage from '../../../components/AccountPage'
import { useIntParam } from '../../../utils/routes'
import Error from 'next/error'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Account = ({ id: stringValue }: { id: string }) => {
  const id = useIntParam(stringValue)

  const router = useRouter()
  useEffect(() => {
    if (id === undefined) {
      router.push('/genres')
    }
  }, [id, router])

  if (id === undefined) {
    return <Error statusCode={404} />
  }

  return <AccountPage id={id} />
}

export default Account
