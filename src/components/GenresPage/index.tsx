import useWindowSize from '../../hooks/useWindowSize'
import SplitPane from '../common/SplitPane'
import GenreNavigator from './GenreNavigator'
import GenreCreate from './GenreView/Create'
import GenreViewPlaceholder from './GenreView/Default'
import GenreEdit from './GenreView/Edit'
import { GenreFormFields } from './GenreView/Form'
import GenreHistory from './GenreView/History'
import GenreView from './GenreView/View'
import { FC, useCallback } from 'react'

export type GenrePageView =
  | { type: 'default' }
  | { type: 'view'; id: number }
  | { type: 'edit'; id: number; autoFocus?: keyof GenreFormFields }
  | { type: 'history'; id: number }
  | { type: 'create' }

const GenrePage: FC<{ view: GenrePageView }> = ({ view }) => {
  const renderGenre = useCallback(() => {
    switch (view.type) {
      case 'default': {
        return <GenreViewPlaceholder />
      }
      case 'view': {
        return <GenreView id={view.id} />
      }
      case 'history': {
        return <GenreHistory id={view.id} />
      }
      case 'edit': {
        return <GenreEdit id={view.id} autoFocus={view.autoFocus} />
      }
      case 'create': {
        return <GenreCreate />
      }
    }
  }, [view])

  const { width } = useWindowSize()

  return (
    <>
      <SplitPane
        defaultSize={300}
        minSize={200}
        maxSize={width - 300}
        className='hidden h-full p-2 pt-0 md:flex'
      >
        <GenreNavigator />
        <div className='h-full rounded-lg border border-gray-200 bg-gray-100 transition dark:border-gray-800 dark:bg-gray-900'>
          {renderGenre()}
        </div>
      </SplitPane>

      {view.type === 'default' && <GenreNavigator className='md:hidden' />}
      {view.type !== 'default' && (
        <div className='h-full md:hidden'>{renderGenre()}</div>
      )}
    </>
  )
}

export default GenrePage
