import { type InferInsertModel, type InferSelectModel, relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core'

export type InsertArtist = InferInsertModel<typeof artists>
export type Artist = InferSelectModel<typeof artists>
export const artists = pgTable('Artist', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
})

export const artistsRelations = relations(artists, ({ many }) => ({
  releases: many(releaseArtists),
  tracks: many(trackArtists),
}))

export type InsertRelease = InferInsertModel<typeof releases>
export type Release = InferSelectModel<typeof releases>
export const releases = pgTable('Release', {
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
  releaseDate: text('release_date').notNull(),
  art: text('art').notNull(),
})

export const releasesRelations = relations(releases, ({ many }) => ({
  artists: many(releaseArtists),
  tracks: many(releaseTracks),
}))

export type InsertReleaseArtist = InferInsertModel<typeof releaseArtists>
export type ReleaseArtist = InferSelectModel<typeof releaseArtists>
export const releaseArtists = pgTable(
  'ReleaseArtist',
  {
    releaseId: integer('release_id')
      .references(() => releases.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    artistId: integer('artist_id')
      .references(() => artists.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    order: integer('order').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.releaseId, table.artistId] }),
  }),
)

export const releaseArtistsRelations = relations(releaseArtists, ({ one }) => ({
  release: one(releases, {
    fields: [releaseArtists.releaseId],
    references: [releases.id],
  }),
  artist: one(artists, {
    fields: [releaseArtists.artistId],
    references: [artists.id],
  }),
}))

export type InsertTrack = InferInsertModel<typeof tracks>
export type Track = InferSelectModel<typeof tracks>
export const tracks = pgTable('Track', {
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
})

export const tracksRelations = relations(tracks, ({ many }) => ({
  artists: many(trackArtists),
  issues: many(trackIssues),
  releases: many(releaseTracks),
}))

export type InsertReleaseTrack = InferInsertModel<typeof releaseTracks>
export type ReleaseTrack = InferSelectModel<typeof releaseTracks>
export const releaseTracks = pgTable(
  'ReleaseTrack',
  {
    releaseId: integer('release_id')
      .references(() => releases.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    trackId: integer('track_id')
      .references(() => tracks.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    order: integer('order').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.releaseId, table.trackId] }),
  }),
)

export const releaseTracksRelations = relations(releaseTracks, ({ one }) => ({
  release: one(releases, {
    fields: [releaseTracks.releaseId],
    references: [releases.id],
  }),
  track: one(tracks, {
    fields: [releaseTracks.trackId],
    references: [tracks.id],
  }),
}))

export type InsertTrackArtist = InferInsertModel<typeof trackArtists>
export type TrackArtist = InferSelectModel<typeof trackArtists>
export const trackArtists = pgTable(
  'TrackArtist',
  {
    trackId: integer('track_id')
      .references(() => tracks.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    artistId: integer('artist_id')
      .references(() => artists.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    order: integer('order').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.trackId, table.artistId] }),
  }),
)

export const trackArtistsRelations = relations(trackArtists, ({ one }) => ({
  track: one(tracks, {
    fields: [trackArtists.trackId],
    references: [tracks.id],
  }),
  artist: one(artists, {
    fields: [trackArtists.artistId],
    references: [artists.id],
  }),
}))

export type InsertReleaseIssue = InferInsertModel<typeof releaseIssues>
export type ReleaseIssue = InferSelectModel<typeof releaseIssues>
export const releaseIssues = pgTable('ReleaseIssue', {
  id: serial('id').primaryKey().notNull(),
  releaseId: integer('release_id')
    .references(() => releases.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  format: text('format').notNull(),
  label: text('label').notNull(),
  catno: text('catno').notNull(),
})

export const releaseIssuesRelations = relations(releaseIssues, ({ one }) => ({
  release: one(releases, {
    fields: [releaseIssues.releaseId],
    references: [releases.id],
  }),
}))

export type InsertTrackIssue = InferInsertModel<typeof trackIssues>
export type TrackIssue = InferSelectModel<typeof trackIssues>
export const trackIssues = pgTable('TrackIssue', {
  id: serial('id').primaryKey().notNull(),
  trackId: integer('track_id')
    .references(() => tracks.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  releaseIssueId: integer('release_issue_id')
    .references(() => releaseIssues.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
})

export const trackIssuesRelations = relations(trackIssues, ({ one }) => ({
  track: one(tracks, {
    fields: [trackIssues.trackId],
    references: [tracks.id],
  }),
  releaseIssue: one(releaseIssues, {
    fields: [trackIssues.releaseIssueId],
    references: [releaseIssues.id],
  }),
}))
