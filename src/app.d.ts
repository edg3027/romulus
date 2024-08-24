// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Locals {
      dbConnection: import('$lib/server/db/connection').IDrizzleConnection
      services: {
        authService: import('$lib/server/ddd/features/auth/application/auth-service').AuthService
        musicCatalogService: import('$lib/server/ddd/features/music-catalog/application/music-catalog-service').MusicCatalogService
        genreService: import('$lib/server/ddd/features/genres/application/genre-service').GenreService
      }
      user: import('lucia').User | undefined
      session: import('lucia').Session | undefined
      lucia: import('$lib/server/auth').AppLucia
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
