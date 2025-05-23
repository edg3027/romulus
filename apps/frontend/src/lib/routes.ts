export const routes = {
  home: {
    route: () => '/',
  },
  genres: {
    route: () => '/genres',
    table: {
      route: () => '/genres/table',
    },
    latest: {
      route: () => '/genres/latest',
    },
    random: {
      route: () => '/genres/random',
    },
  },
  media: {
    types: {
      route: () => '/media/types',
      create: {
        route: () => `${routes.media.types.route()}/create`,
      },
      details: {
        route: (id: string) => `${routes.media.types.route()}/${id}`,
        edit: {
          route: (id: string) => `${routes.media.types.route()}/${id}/edit`,
        },
        delete: {
          route: (id: string) => `${routes.media.types.route()}/${id}/delete`,
        },
      },
    },
    artifactTypes: {
      route: () => '/media/artifact-types',
      create: {
        route: () => `${routes.media.artifactTypes.route()}/create`,
      },
      details: {
        route: (id: string) => `${routes.media.artifactTypes.route()}/${id}`,
        edit: {
          route: (id: string) => `${routes.media.artifactTypes.details.route(id)}/edit`,
        },
        delete: {
          route: (id: string) => `${routes.media.artifactTypes.details.route(id)}/delete`,
        },
      },
    },
    artifactRelationshipTypes: {
      route: () => `/media/artifact-relationship-types`,
      create: {
        route: () => `${routes.media.artifactRelationshipTypes.route()}/create`,
      },
      details: {
        route: (id: string) => `${routes.media.artifactRelationshipTypes.route()}/${id}`,
        edit: {
          route: (id: string) => `${routes.media.artifactRelationshipTypes.details.route(id)}/edit`,
        },
      },
    },
  },
}
