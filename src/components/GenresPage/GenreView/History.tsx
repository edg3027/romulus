import { DefaultGenreHistory } from '../../../server/db/genre-history/outputs'
import { useGenreHistoryQuery } from '../../../services/genre-history'
import { capitalize } from '../../../utils/string'
import { isEmpty } from '../../../utils/types'
import GenreLink from '../../common/GenreLink'
import IconButton from '../../common/IconButton'
import Label from '../../common/Label'
import { CenteredLoader } from '../../common/Loader'
import Romcode from '../../common/Romcode'
import Tooltip from '../../common/Tooltip'
import GenreTypeChip from '../GenreTypeChip'
import { CrudOperation, GenreHistoryAka } from '@prisma/client'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import clsx from 'clsx'
import { compareAsc, format } from 'date-fns'
import Link from 'next/link'
import { equals, uniq } from 'ramda'
import { FC, useCallback, useMemo, useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri'

const GenreHistory: FC<{ id: number }> = ({ id }) => {
  const historyQuery = useGenreHistoryQuery(id)

  if (historyQuery.data) {
    return <HasData history={historyQuery.data} />
  }

  if (historyQuery.error) {
    return <div>Error fetching history :(</div>
  }

  return <CenteredLoader />
}

const columnHelper = createColumnHelper<DefaultGenreHistory>()

const HasData: FC<{ history: DefaultGenreHistory[] }> = ({
  history: unsortedHistory,
}) => {
  const history = useMemo(
    () =>
      unsortedHistory.sort((a, b) => {
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
    [unsortedHistory],
  )

  const genre = useMemo(() => {
    const latestHistory = history.at(-1)
    if (!latestHistory) return
    return {
      id: latestHistory.treeGenreId,
      name: latestHistory.name,
      subtitle: latestHistory.subtitle,
    }
  }, [history])

  return (
    <div className='h-full flex-1 overflow-auto p-4'>
      <div className='flex items-center border-b border-gray-100 pb-4 dark:border-gray-800'>
        {genre ? (
          <>
            <GenreLink
              id={genre.id}
              className='mr-1.5 rounded-full p-1.5 text-gray-600 hover:bg-primary-100 hover:text-primary-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-primary-700'
            >
              <IoMdArrowBack size={18} />
            </GenreLink>
            <div className='text-2xl font-bold text-gray-600 dark:text-gray-400'>
              {genre.name}
              {genre.subtitle && (
                <>
                  {' '}
                  <span className='text-lg text-gray-500'>
                    [{genre.subtitle}]
                  </span>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <span className='mr-1.5 rounded-full p-1.5 text-gray-600 hover:bg-primary-100 hover:text-primary-700'>
              <IoMdArrowBack size={18} />
            </span>
            <div className='text-2xl font-bold text-gray-600'>Loading...</div>
          </>
        )}
      </div>

      <div className='pt-4'>
        {history.length > 0 ? (
          <Table history={history} />
        ) : (
          <div className='flex justify-center text-gray-600'>No history</div>
        )}
      </div>
    </div>
  )
}

const Table: FC<{ history: DefaultGenreHistory[] }> = ({ history }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean | undefined>>(
    {},
  )

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'expand',
        cell: (props) => {
          const id = props.row.id
          const isExpanded = !!expanded[id]
          return (
            <Tooltip tip={`${isExpanded ? 'Hide' : 'Show'} Changes`}>
              <IconButton
                onClick={() =>
                  setExpanded((e) => ({ ...e, [id]: !isExpanded }))
                }
              >
                {isExpanded ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
              </IconButton>
            </Tooltip>
          )
        },
      }),
      columnHelper.accessor('operation', {
        header: 'Change',
        cell: (props) => capitalize(props.getValue()),
      }),
      columnHelper.accessor('account', {
        header: 'Contributor',
        cell: (props) => {
          const account = props.getValue()

          if (!account) {
            return <div className='text-gray-500 line-through'>Deleted</div>
          }

          return (
            <Link
              href={`/accounts/${account.id}`}
              className='text-primary-500 hover:underline'
            >
              {account.username}
            </Link>
          )
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: (props) => format(props.getValue(), 'PPpp'),
      }),
    ],
    [expanded],
  )

  const table = useReactTable({
    data: history,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className='w-full'>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className='p-1 px-2 text-left'
                style={{ width: header.id === 'expand' ? 0 : undefined }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, i) => {
          const isExpanded = !!expanded[row.id]
          const lastRow = table.getRowModel().rows[i - 1]

          return (
            <>
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='p-1 px-2'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>

              {isExpanded && (
                <tr>
                  <td />
                  <td className='p-1 px-2' colSpan={3}>
                    <Diff
                      lastHistory={lastRow?.original}
                      thisHistory={row.original}
                    />
                  </td>
                </tr>
              )}
            </>
          )
        })}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  )
}

type DiffAction = 'create' | 'update' | 'delete' | null

const Diff: FC<{
  lastHistory?: DefaultGenreHistory
  thisHistory: DefaultGenreHistory
}> = ({ lastHistory, thisHistory }) => {
  const getAction = useCallback(
    <T,>(fn: (hist: DefaultGenreHistory) => T): DiffAction => {
      if (thisHistory.operation === CrudOperation.DELETE) {
        return 'delete'
      }

      const thisValue = fn(thisHistory)

      if (!lastHistory) {
        return isEmpty(thisValue) ? null : 'create'
      }

      const lastValue = fn(lastHistory)

      if (isEmpty(lastValue) && !isEmpty(thisValue)) {
        return 'create'
      }

      if (equals(lastValue, thisValue)) {
        return null
      }

      return isEmpty(thisValue) ? 'delete' : 'update'
    },
    [lastHistory, thisHistory],
  )

  const changed = useMemo(
    () => ({
      name: getAction((h) => h.name),
      subtitle: getAction((h) => h.subtitle),
      type: getAction((h) => h.type),
      shortDescription: getAction((h) => h.shortDescription),
      longDescription: getAction((h) => h.longDescription),
      notes: getAction((h) => h.notes),
      akas: getAction(
        (h) =>
          new Set(
            uniq(
              h.akas.map((aka) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { genreId, ...data } = aka
                return data
              }),
            ),
          ),
      ),
      parentGenreIds: getAction((h) => new Set(h.parentGenreIds)),
      influencedByGenreIds: getAction((h) => new Set(h.influencedByGenreIds)),
    }),
    [getAction],
  )

  const getActionClass = useCallback((action: DiffAction) => {
    switch (action) {
      case 'create': {
        return 'border border-green-500 bg-green-300'
      }
      case 'update': {
        return 'border border-yellow-500 bg-yellow-300'
      }
      case 'delete': {
        return 'border border-red-500 bg-red-300'
      }
    }
  }, [])

  return (
    <div className='flex space-x-3'>
      {lastHistory ? (
        <div className='flex-1 rounded border border-gray-300 bg-gray-100'>
          <div className='border-b border-gray-200 p-2 px-3 text-sm font-bold uppercase tracking-wide text-gray-500'>
            Before
          </div>
          <div className='space-y-3 p-2 px-3'>
            {lastHistory.name && (
              <div>
                <Label>Name</Label>
                <div>{lastHistory.name}</div>
              </div>
            )}
            {lastHistory.subtitle && (
              <div>
                <Label>Subtitle</Label>
                <div>{lastHistory.subtitle}</div>
              </div>
            )}
            {lastHistory.type && (
              <div>
                <Label>Type</Label>
                <div>
                  <GenreTypeChip type={lastHistory.type} />
                </div>
              </div>
            )}
            {lastHistory.shortDescription && (
              <div>
                <Label>Short Description</Label>
                <Romcode>{lastHistory.shortDescription}</Romcode>
              </div>
            )}
            {lastHistory.longDescription && (
              <div>
                <Label>Long Description</Label>
                <Romcode>{lastHistory.longDescription}</Romcode>
              </div>
            )}
            {lastHistory.notes && (
              <div>
                <Label>Notes</Label>
                <Romcode>{lastHistory.notes}</Romcode>
              </div>
            )}
            {lastHistory.akas.length > 0 && (
              <div>
                <Label>AKAs</Label>
                <AKAs akas={lastHistory.akas} />
              </div>
            )}
            {lastHistory.parentGenreIds.length > 0 && (
              <div>
                <Label>Parents</Label>
                <div>
                  <ul className='comma-list'>
                    {lastHistory.parentGenreIds.map((id) => (
                      <li
                        key={id}
                        className='font-bold text-primary-500 hover:underline'
                      >
                        <GenreLink id={id} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {lastHistory.influencedByGenreIds.length > 0 && (
              <div>
                <Label>Influences</Label>
                <div>
                  <ul className='comma-list'>
                    {lastHistory.influencedByGenreIds.map((id) => (
                      <li key={id} className='text-primary-500 hover:underline'>
                        <GenreLink id={id} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='flex flex-1 flex-col rounded border border-gray-300 bg-gray-100'>
          <div className='border-b border-gray-200 p-2 px-3 text-sm font-bold uppercase tracking-wide text-gray-500'>
            Before
          </div>
          <div className='flex flex-1 items-center justify-center text-sm text-gray-500'>
            None
          </div>
        </div>
      )}

      {thisHistory.operation === CrudOperation.DELETE ? (
        <div className='flex flex-1 flex-col rounded border border-red-300 bg-red-100'>
          <div className='border-b border-red-200 p-2 px-3 text-sm font-bold uppercase tracking-wide text-red-500'>
            After
          </div>
          <div className='flex flex-1 items-center justify-center text-sm text-red-500'>
            Deleted
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            'flex-1 rounded border',
            thisHistory.operation === CrudOperation.CREATE
              ? 'border-green-300 bg-green-100'
              : 'border-gray-300 bg-gray-100',
          )}
        >
          <div
            className={clsx(
              'border-b p-2 px-3 text-sm font-bold uppercase tracking-wide',
              thisHistory.operation === CrudOperation.CREATE
                ? 'border-green-200 text-green-500'
                : 'border-gray-200 text-gray-500',
            )}
          >
            After
          </div>
          <div className='space-y-1 p-1'>
            {(thisHistory.name || changed.name) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.name),
                )}
              >
                <Label>Name</Label>
                <div>{thisHistory.name}</div>
              </div>
            )}
            {(thisHistory.subtitle || changed.subtitle) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.subtitle),
                )}
              >
                <Label>Subtitle</Label>
                <div>{thisHistory.subtitle}</div>
              </div>
            )}
            {(thisHistory.type || changed.type) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.type),
                )}
              >
                <Label>Type</Label>
                <div>
                  <GenreTypeChip type={thisHistory.type} />
                </div>
              </div>
            )}
            {(thisHistory.shortDescription || changed.shortDescription) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.shortDescription),
                )}
              >
                <Label>Short Description</Label>
                <Romcode>{thisHistory.shortDescription ?? ''}</Romcode>
              </div>
            )}
            {(thisHistory.longDescription || changed.longDescription) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.longDescription),
                )}
              >
                <Label>Long Description</Label>
                <Romcode>{thisHistory.longDescription ?? ''}</Romcode>
              </div>
            )}
            {(thisHistory.notes || changed.notes) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.notes),
                )}
              >
                <Label>Notes</Label>
                <Romcode>{thisHistory.notes ?? ''}</Romcode>
              </div>
            )}
            {(thisHistory.akas.length > 0 || changed.akas) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.akas),
                )}
              >
                <Label>AKAs</Label>
                <AKAs akas={thisHistory.akas} />
              </div>
            )}
            {(thisHistory.parentGenreIds.length > 0 ||
              changed.parentGenreIds) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.parentGenreIds),
                )}
              >
                <Label>Parents</Label>
                <div>
                  <ul className='comma-list'>
                    {thisHistory.parentGenreIds.map((id) => (
                      <li
                        key={id}
                        className='font-bold text-primary-500 hover:underline'
                      >
                        <GenreLink id={id} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {(thisHistory.influencedByGenreIds.length > 0 ||
              changed.influencedByGenreIds) && (
              <div
                className={clsx(
                  'rounded p-1 px-2',
                  getActionClass(changed.influencedByGenreIds),
                )}
              >
                <Label>Influences</Label>
                <div>
                  <ul className='comma-list'>
                    {thisHistory.influencedByGenreIds.map((id) => (
                      <li key={id} className='text-primary-500 hover:underline'>
                        <GenreLink id={id} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const AKAs: FC<{ akas: GenreHistoryAka[] }> = ({ akas }) => (
  <div>
    {akas
      .sort((a, b) => b.relevance - a.relevance || a.order - b.order)
      .map((aka) => aka.name)
      .join(', ')}
  </div>
)

export default GenreHistory
