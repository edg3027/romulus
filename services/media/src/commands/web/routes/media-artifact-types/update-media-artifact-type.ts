import { type } from 'arktype'

import type { RouteDefinition } from '../../../../common/web/utils.js'
import type { RouteResponse } from '../../../../common/web/utils.js'
import { createErrorResponse } from '../../../../common/web/utils.js'
import { createRoute } from '../../../../common/web/utils.js'
import { validator } from '../../../../common/web/utils.js'
import { factory } from '../../../../common/web/utils.js'
import { assertUnreachable } from '../../../../utils.js'
import type { UpdateMediaArtifactTypeCommandHandler } from '../../../application/media-artifact-types/update-media-artifact-type.js'
import { MediaArtifactTypeNotFoundError } from '../../../domain/media-artifact-types/errors.js'
import { MediaTypeNotFoundError } from '../../../domain/media-types/errors.js'
import { MediaPermission } from '../../../domain/permissions.js'
import type { AuthorizationMiddleware } from '../../authorization-middleware.js'
import {
  badRequestErrorResponse,
  unauthenticatedErrorResponse,
  unauthorizedErrorResponse,
} from '../../errors.js'

export function createUpdateMediaArtifactTypeRoute({
  authz,
  updateMediaArtifactType,
}: UpdateMediaArtifactTypeRouteDependencies) {
  return factory.createHandlers(
    createRoute(definition),
    validator('param', type({ id: 'string' })),
    validator('json', type({ name: 'string', mediaTypes: 'string[]' })),
    authz(MediaPermission.WriteMediaArtifactTypes),
    async (c): Promise<RouteResponse<typeof definition>> => {
      const param = c.req.valid('param')
      const body = c.req.valid('json')
      const result = await updateMediaArtifactType({
        id: param.id,
        update: body,
        userId: c.var.user.id,
      })
      return result.match(
        () => c.json({ success: true }, 200),
        (err) => {
          if (err instanceof MediaTypeNotFoundError) {
            return c.json(
              {
                success: false,
                error: {
                  name: err.name,
                  message: err.message,
                  statusCode: 422,
                },
              },
              422,
            )
          } else if (err instanceof MediaArtifactTypeNotFoundError) {
            return c.json(
              {
                success: false,
                error: {
                  name: err.name,
                  message: err.message,
                  statusCode: 404,
                },
              },
              404,
            )
          } else {
            assertUnreachable(err)
          }
        },
      )
    },
  )
}

export type UpdateMediaArtifactTypeRouteDependencies = {
  authz: AuthorizationMiddleware
  updateMediaArtifactType: UpdateMediaArtifactTypeCommandHandler
}

const definition = {
  description: 'Update a media artifact type',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: type({ success: 'true' }),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: badRequestErrorResponse,
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: {
        'application/json': {
          schema: unauthenticatedErrorResponse,
        },
      },
    },
    403: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedErrorResponse,
        },
      },
    },
    404: {
      description: 'Media artifact type not found',
      content: {
        'application/json': {
          schema: createErrorResponse(type('"MediaArtifactTypeNotFoundError"'), type('404')),
        },
      },
    },
    422: {
      description: 'Referenced media type does not exist',
      content: {
        'application/json': {
          schema: createErrorResponse(type('"MediaTypeNotFoundError"'), type('422')),
        },
      },
    },
  },
} satisfies RouteDefinition
