import { CrudOperation } from '@prisma/client'
import { compareAsc } from 'date-fns'
import Link, { LinkProps } from 'next/link'
import { FC, ReactNode, useMemo } from 'react'

import { useGenreHistoryQuery } from '../../services/genre-history'
import { useSimpleGenreQuery } from '../../services/genres'
import { GenrePageView } from '../GenresPage'
import { GenreFormFields } from '../GenresPage/GenreView/Form'

export const useGenreLinkHref = (
  id: number,
  view?: GenrePageView['type'],
  autoFocus?: keyof GenreFormFields
) => {
  const href = useMemo(() => {
    let path = `/genres?id=${id}`
    if (view) path += `&view=${view}`
    if (autoFocus) path += `&focus=${autoFocus}`
    return path
  }, [autoFocus, id, view])

  return href
}

const GenreLink: FC<
  Omit<LinkProps, 'href'> & {
    id: number
    view?: GenrePageView['type']
    autoFocus?: keyof GenreFormFields
    className?: string
    children?: ReactNode
  }
> = ({ id, view, autoFocus, children, className, ...props }) => {
  const href = useGenreLinkHref(id, view, autoFocus)

  const genreQuery = useSimpleGenreQuery(id, { showToast: false })

  if (genreQuery.data) {
    return (
      <Link href={href} {...props} className={className}>
        {children ?? genreQuery.data.name}
      </Link>
    )
  }

  if (genreQuery.error) {
    const isMissing = genreQuery.error.message.startsWith('No genre with id')
    return isMissing ? (
      <DeletedLinkWrapper
        id={id}
        autoFocus={autoFocus}
        className={className}
        defaultHref={href}
      >
        {children}
      </DeletedLinkWrapper>
    ) : (
      <Link href={href} {...props} className={className}>
        {children ?? 'Error'}
      </Link>
    )
  }

  return (
    <Link href={href} {...props} className={className}>
      {children ?? 'Loading...'}
    </Link>
  )
}

const DeletedLinkWrapper: FC<
  Omit<LinkProps, 'href'> & {
    id: number
    autoFocus?: keyof GenreFormFields
    className?: string
    children?: ReactNode
    defaultHref: LinkProps['href']
  }
> = ({ id, autoFocus, children, className, defaultHref, ...props }) => {
  const historyHref = useGenreLinkHref(id, 'history', autoFocus)

  const historyQuery = useGenreHistoryQuery(id)

  const history = useMemo(
    () =>
      (historyQuery.data ?? []).sort((a, b) => {
        // always show CREATE first
        if (
          a.operation === CrudOperation.CREATE &&
          b.operation !== CrudOperation.CREATE
        ) {
          return -1
        } else if (
          b.operation === CrudOperation.CREATE &&
          a.operation !== CrudOperation.CREATE
        ) {
          return 1
        }

        return compareAsc(a.createdAt, b.createdAt)
      }),
    [historyQuery.data]
  )

  const genre = useMemo(() => {
    const latestHistory = history[history.length - 1]
    if (!latestHistory) return
    return {
      id: latestHistory.treeGenreId,
      name: latestHistory.name,
      subtitle: latestHistory.subtitle,
    }
  }, [history])

  if (historyQuery.data) {
    return genre ? (
      <Link href={historyHref} {...props} className={className}>
        {children ?? `${genre.name} (Deleted)`}
      </Link>
    ) : (
      <Link href={defaultHref} {...props} className={className}>
        {children ?? 'Deleted'}
      </Link>
    )
  }

  if (historyQuery.error) {
    return (
      <Link href={defaultHref} {...props} className={className}>
        {children ?? 'Error'}
      </Link>
    )
  }

  return (
    <Link href={defaultHref} {...props} className={className}>
      {children ?? 'Loading...'}
    </Link>
  )
}

export default GenreLink
