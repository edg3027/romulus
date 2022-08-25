import type { NextPage } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'

import GenrePage, { GenrePageState } from '../../components/GenrePage'
import { isGenreFormField } from '../../components/GenrePage/GenreForm'
import { useCustomRouteParam, useIntRouteParam } from '../../utils/routes'

const Genre: NextPage = () => {
  const id = useIntRouteParam('id')

  const view = useCustomRouteParam(
    'view',
    (value): value is 'edit' | 'history' =>
      value === 'edit' || value === 'history'
  )

  const focus = useCustomRouteParam('focus', isGenreFormField)

  const scrollTo = useIntRouteParam('scrollTo')

  const state: GenrePageState | undefined = useMemo(() => {
    if (id === undefined) {
      return
    } else if (view === 'edit') {
      return { type: 'edit', id, autoFocus: focus }
    } else if (view === 'history') {
      return { type: 'history', id }
    } else {
      return { type: 'view', id, scrollTo }
    }
  }, [focus, id, scrollTo, view])

  const router = useRouter()
  useEffect(() => {
    if (state === undefined) {
      void router.push({ pathname: '/genres' })
    }
  }, [router, state])

  if (state === undefined) {
    return <Error statusCode={404} />
  }

  return <GenrePage state={state} />
}

export default Genre
