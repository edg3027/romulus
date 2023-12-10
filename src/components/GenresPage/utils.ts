import { uniqBy } from 'ramda'

import { isNotNull } from '../../utils/types'
import { TreeGenre } from './GenreNavigator/Tree/state'

export const getGenreRelevanceText = (relevance: number) => {
  switch (relevance) {
    case 0: {
      return 'Invented'
    }
    case 1: {
      return 'Unknown'
    }
    case 2: {
      return 'Unestablished'
    }
    case 3: {
      return 'Minor'
    }
    case 4: {
      return 'Significant'
    }
    case 5: {
      return 'Major'
    }
    case 6: {
      return 'Essential'
    }
    case 7: {
      return 'Universal'
    }
    default: {
      throw new Error(`Not a valid relevance: ${relevance}`)
    }
  }
}

export const getFilteredParentGenres = <T extends TreeGenre>(
  genre: T,
  genreRelevanceFilter: number,
  genreMap: Map<number, T>
) =>
  uniqBy(
    (g) => g.id,
    genre.parents
      .flatMap((id) => {
        const parentGenre = genreMap.get(id)
        if (!parentGenre) return null
        if (parentGenre.relevance >= genreRelevanceFilter) return parentGenre

        const ancestors = []
        const stack = [...parentGenre.parents]
        let curr = stack.pop()
        while (curr !== undefined) {
          const genre = genreMap.get(curr)
          if (!genre) continue

          if (genre.relevance >= genreRelevanceFilter) {
            ancestors.push(genre)
          } else {
            stack.push(...genre.parents)
          }

          curr = stack.pop()
        }

        return ancestors
      })
      .filter(isNotNull)
  )

export const getFilteredChildGenres = <T extends TreeGenre>(
  genre: T,
  genreRelevanceFilter: number,
  genreMap: Map<number, T>
) =>
  uniqBy(
    (g) => g.id,
    genre.children
      .flatMap((id) => {
        const childGenre = genreMap.get(id)
        if (!childGenre) return null
        if (childGenre.relevance >= genreRelevanceFilter) return childGenre

        const descendants = []
        const stack = [...childGenre.children]
        let curr = stack.pop()
        while (curr !== undefined) {
          const genre = genreMap.get(curr)
          if (!genre) continue

          if (genre.relevance >= genreRelevanceFilter) {
            descendants.push({ id: genre.id, name: genre.name })
          } else {
            stack.push(...genre.children)
          }

          curr = stack.pop()
        }

        return descendants
      })
      .filter(isNotNull)
  )
