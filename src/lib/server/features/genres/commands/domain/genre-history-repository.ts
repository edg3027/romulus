import type { GenreHistory } from './genre-history'

export type GenreHistoryRepository = {
  findLatestByGenreId(genreId: number): Promise<GenreHistory | undefined>
  create(history: GenreHistory): Promise<void>
}