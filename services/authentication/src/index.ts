import type { IAuthorizationApplication } from '@romulus/authorization'

import type { IAuthenticationApplication } from './application'
import { AuthenticationPermission } from './domain/permissions'
import type { IDrizzleConnection } from './infrastructure/drizzle-database'
import {
  getDbConnection,
  getPostgresConnection,
  migrate,
} from './infrastructure/drizzle-postgres-connection'
import { CommandsCompositionRoot } from './web/composition-root'
import type { Router } from './web/router'
import { createRouter } from './web/router'

export type { IAuthenticationApplication } from './application'
export { AuthenticationClient, AuthenticationClientError } from './web/client'

export class AuthenticationService {
  private constructor(
    private db: IDrizzleConnection,
    private di: CommandsCompositionRoot,
  ) {}

  static async create(
    databaseUrl: string,
    authorization: IAuthorizationApplication,
  ): Promise<AuthenticationService> {
    const pg = getPostgresConnection(databaseUrl)
    const db = getDbConnection(pg)
    await migrate(db)

    const di = new CommandsCompositionRoot(db, authorization)

    await authorization.ensurePermissions([
      { name: AuthenticationPermission.RequestPasswordReset, description: undefined },
    ])

    return new AuthenticationService(db, di)
  }

  use(): IAuthenticationApplication {
    return this.di.application()
  }

  getRouter(): Router {
    return createRouter(this.di)
  }

  async destroy(): Promise<void> {
    await this.db.close()
  }
}
