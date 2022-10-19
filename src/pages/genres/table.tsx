import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'
import { RiSortAsc, RiSortDesc } from 'react-icons/ri'

import { CenteredLoader } from '../../components/common/Loader'
import Paginator from '../../components/common/Paginator'
import RelevanceChip from '../../components/GenresPage/GenreNavigator/Tree/RelevanceChip'
import GenreTypeChip from '../../components/GenresPage/GenreTypeChip'
import { DefaultGenre } from '../../server/db/genre/outputs'
import { useGenresQuery } from '../../services/genres'
import { useIntRouteParam } from '../../utils/routes'

const GenresTable: FC = () => {
  const genresQuery = useGenresQuery()

  const page = useIntRouteParam('page')
  const size = useIntRouteParam('size')

  if (genresQuery.data) {
    return <HasData genres={genresQuery.data} page={page} size={size} />
  }

  if (genresQuery.error) {
    return <div>Error fetching genres :(</div>
  }

  return <CenteredLoader />
}

const columnHelper = createColumnHelper<DefaultGenre>()

const defaultColumns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (props) => {
      const genre = props.row.original

      return (
        <Link
          href={{ pathname: '/genres', query: { id: genre.id.toString() } }}
        >
          <a className='block text-gray-700 hover:font-bold'>
            {genre.name}
            {genre?.subtitle && (
              <>
                {' '}
                <span className='text-sm text-gray-600'>
                  [{genre.subtitle}]
                </span>
              </>
            )}
          </a>
        </Link>
      )
    },
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (props) => <GenreTypeChip type={props.getValue()} />,
  }),
  columnHelper.accessor('relevance', {
    header: 'Relevance',
    cell: (props) => <RelevanceChip relevance={props.getValue()} />,
  }),
]

const HasData: FC<{ genres: DefaultGenre[]; page?: number; size?: number }> = ({
  genres,
  page = 0,
  size: rawSize = 30,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ])

  const size = useMemo(() => Math.min(rawSize, 100), [rawSize])

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: size,
    pageIndex: page,
  })

  const router = useRouter()

  const table = useReactTable({
    data: genres,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: (p) => {
      const pa = typeof p === 'function' ? p(pagination) : p
      setPagination(p)
      void router.push({
        query: { page: pa.pageIndex.toString(), size: pa.pageSize.toString() },
      })
    },
  })

  return (
    <div className='p-4'>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='p-1 px-2 text-left'>
                  {header.isPlaceholder ? null : (
                    <div
                      className={clsx(
                        'flex items-center space-x-1',
                        header.column.getCanSort() &&
                          'cursor-pointer select-none'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {{
                        asc: <RiSortAsc className='text-primary-500' />,
                        desc: <RiSortDesc className='text-primary-500' />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='p-1 px-2'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
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
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>

      <Paginator table={table} />
    </div>
  )
}

export default GenresTable
