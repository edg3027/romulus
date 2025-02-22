import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'

import type * as schema from './drizzle-schema.js'

export type IDrizzleConnection = PgDatabase<PgQueryResultHKT, typeof schema>
