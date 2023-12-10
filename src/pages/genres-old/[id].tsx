import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useIntRouteParam } from '../../utils/routes'

const GenrePage: NextPage = () => {
  const id = useIntRouteParam('id')

  const router = useRouter()
  useEffect(() => {
    const url = new URL('/genres')
    if (id !== undefined) {
      url.searchParams.set('id', id.toString())
    }
    router.replace(url.toString())
  }, [id, router])

  return <div />
}

export default GenrePage
