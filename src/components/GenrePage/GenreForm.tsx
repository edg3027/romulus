import { GenreType, Permission } from '@prisma/client'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { DefaultGenre } from '../../server/db/genre/types'
import { useSession } from '../../services/auth'
import { ifDefined } from '../../utils/types'
import { ButtonPrimary, ButtonTertiary } from '../common/Button'
import Loader from '../common/Loader'
import MarkdownEditor from '../common/MarkdownEditor'
import GenreMultiselect from './GenreMultiselect'

const GenreFormFields = {
  name: '',
  type: GenreType.STYLE as GenreType,
  akas: '',
  shortDescription: '',
  longDescription: '',
  notes: '',
}

export type GenreFormFields = typeof GenreFormFields

export const isGenreFormField = (t: string): t is keyof GenreFormFields =>
  t in GenreFormFields

export type GenreFormData = {
  name: string
  type: GenreType
  akas: string[]
  shortDescription: string | null
  longDescription: string | null
  notes: string | null
  parentGenres: number[]
  influencedByGenres: number[]
}

const GenreForm: FC<{
  genre?: DefaultGenre
  onSubmit: (data: GenreFormData) => void
  onClose: () => void
  autoFocus?: keyof GenreFormFields
  isSubmitting?: boolean
}> = ({ genre, onSubmit, onClose, autoFocus, isSubmitting }) => {
  const session = useSession()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setFocus,
  } = useForm<GenreFormFields>({
    defaultValues: {
      name: genre?.name ?? '',
      type: genre?.type ?? 'STYLE',
      akas: ifDefined(genre?.akas, (akas) => akas.join(', ')),
      shortDescription: genre?.shortDescription ?? '',
      longDescription: genre?.longDescription ?? '',
      notes: genre?.notes ?? '',
    },
  })

  const [parentGenres, setParentGenres] = useState<number[]>(
    genre?.parentGenres.map((genre) => genre.id) ?? []
  )
  const [influencedByGenres, setInfluencedByGenres] = useState<number[]>(
    genre?.influencedByGenres.map((genre) => genre.id) ?? []
  )

  const submitHandler = useCallback(
    (data: GenreFormFields) =>
      onSubmit({
        name: data.name,
        type: data.type,
        akas: data.akas
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        shortDescription:
          data.shortDescription.length > 0 ? data.shortDescription : null,
        longDescription:
          data.longDescription.length > 0 ? data.longDescription : null,
        notes: data.notes.length > 0 ? data.notes : null,
        parentGenres,
        influencedByGenres,
      }),
    [influencedByGenres, onSubmit, parentGenres]
  )

  useEffect(() => setFocus(autoFocus ?? 'name'), [autoFocus, setFocus])

  const router = useRouter()
  const hasDirtyFields = useMemo(
    () => Object.values(dirtyFields).some((dirty) => !!dirty),
    [dirtyFields]
  )
  useEffect(() => {
    const confirmationMessage = 'Changes you made may not be saved.'
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      ;(e || window.event).returnValue = confirmationMessage
      return confirmationMessage // Gecko + Webkit, Safari, Chrome etc.
    }
    const beforeRouteHandler = (url: string) => {
      if (router.pathname !== url && !confirm(confirmationMessage)) {
        // to inform NProgress or something ...
        router.events.emit('routeChangeError')
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`
      }
    }
    if (hasDirtyFields) {
      window.addEventListener('beforeunload', beforeUnloadHandler)
      router.events.on('routeChangeStart', beforeRouteHandler)
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
      router.events.off('routeChangeStart', beforeRouteHandler)
    }
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
      router.events.off('routeChangeStart', beforeRouteHandler)
    }
  }, [hasDirtyFields, router.events, router.pathname])

  return (
    <form
      onSubmit={(e) => void handleSubmit(submitHandler)(e)}
      className='flex flex-col h-full'
    >
      <div className='space-y-3 w-full flex-1 overflow-auto p-4'>
        <div>
          <label
            htmlFor='name'
            className={clsx(
              'block text-gray-700 text-sm',
              errors.name && 'text-red-600'
            )}
          >
            Name
          </label>
          <input
            id='name'
            className={clsx(
              'border rounded-sm p-1 px-2 mt-0.5',
              errors.name && 'border-red-600 outline-red-600'
            )}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <div className='text-sm text-red-600'>{errors.name.message}</div>
          )}
        </div>

        <div>
          <label
            htmlFor='akas'
            className={clsx(
              'block text-gray-700 text-sm',
              errors.akas && 'text-red-600'
            )}
          >
            AKAs
          </label>
          <input
            id='akas'
            className={clsx(
              'border rounded-sm p-1 px-2 mt-0.5',
              errors.akas && 'border-red-600 outline-red-600'
            )}
            {...register('akas')}
          />
          {errors.akas && (
            <div className='text-sm text-red-600'>{errors.akas.message}</div>
          )}
        </div>

        <div>
          <label
            htmlFor='type'
            className={clsx(
              'block text-gray-700 text-sm',
              errors.type && 'text-red-600'
            )}
          >
            Type
          </label>
          <select
            id='type'
            className={clsx(
              'border rounded-sm p-1 px-2 mt-0.5 capitalize',
              errors.type && 'border-red-600 outline-red-600'
            )}
            {...register('type')}
          >
            {Object.values(GenreType).map((type) => (
              <option key={type} value={type}>
                {type.toLowerCase()}
              </option>
            ))}
          </select>
          {errors.type && (
            <div className='text-sm text-red-600'>{errors.type.message}</div>
          )}
        </div>

        <div>
          <label className='block text-gray-700 text-sm'>Parents</label>
          <GenreMultiselect
            excludeIds={[
              ...(genre !== undefined ? [genre.id] : []),
              ...(genre?.childGenres.map(({ id }) => id) ?? []),
            ]}
            selectedIds={parentGenres}
            onChange={(g) => setParentGenres(g)}
          />
        </div>

        <div>
          <label className='block text-gray-700 text-sm'>Influences</label>
          <GenreMultiselect
            excludeIds={genre !== undefined ? [genre.id] : []}
            selectedIds={influencedByGenres}
            onChange={(g) => setInfluencedByGenres(g)}
          />
        </div>

        <div>
          <label
            htmlFor='short-description'
            className={clsx(
              'block text-gray-700 text-sm',
              errors.shortDescription && 'text-red-600'
            )}
          >
            Short Description
          </label>
          <textarea
            id='short-description'
            className={clsx(
              'border rounded-sm p-1 px-2 mt-0.5 w-full',
              errors.shortDescription && 'border-red-600 outline-red-600'
            )}
            {...register('shortDescription')}
          />
          {errors.shortDescription && (
            <div className='text-sm text-red-600'>
              {errors.shortDescription.message}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor='long-description'
            className={clsx(
              'block text-gray-700 text-sm',
              errors.longDescription && 'text-red-600'
            )}
          >
            Long Description{' '}
            <a
              href='https://www.markdownguide.org/cheat-sheet'
              target='_blank'
              rel='noreferrer'
              className='text-blue-500 hover:underline text-xs'
            >
              (Formatting Guide)
            </a>
          </label>
          <Controller
            name='longDescription'
            control={control}
            render={({ field }) => (
              <MarkdownEditor id='long-description' {...field} />
            )}
          />
          {errors.longDescription && (
            <div className='text-sm text-red-600'>
              {errors.longDescription.message}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor='notes'
            className={clsx(
              'block text-gray-700 text-sm',
              errors.notes && 'text-red-600'
            )}
          >
            Notes
          </label>
          <Controller
            name='notes'
            control={control}
            render={({ field }) => <MarkdownEditor id='notes' {...field} />}
          />
          {errors.notes && (
            <div className='text-sm text-red-600'>{errors.notes.message}</div>
          )}
        </div>
      </div>

      <div className='flex p-1 space-x-1 border-t'>
        {session.isLoggedIn &&
          session.hasPermission(Permission.EDIT_GENRES) &&
          (isSubmitting ? (
            <ButtonPrimary
              type='submit'
              className='flex-1 flex items-center justify-center space-x-2'
              disabled
            >
              <Loader className='text-white' size={16} />
              <div>Submitting...</div>
            </ButtonPrimary>
          ) : (
            <ButtonPrimary type='submit' className='flex-1'>
              Submit
            </ButtonPrimary>
          ))}
        <ButtonTertiary
          type='button'
          className='flex-1'
          onClick={() => onClose()}
        >
          Cancel
        </ButtonTertiary>
      </div>
    </form>
  )
}

export default GenreForm
