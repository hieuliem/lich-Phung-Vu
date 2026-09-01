import { date, index, integer, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';

export const celebrations = pgTable('celebrations', {
  id: serial('id').primaryKey(), slug: text('slug').notNull(), title: text('title').notNull(),
  celebrationDate: date('celebration_date', { mode: 'string' }).notNull(), liturgicalYear: text('liturgical_year').notNull(),
  season: text('season').notNull(), rank: text('rank').notNull(), color: text('color').notNull(), summary: text('summary'),
}, (table) => [uniqueIndex('idx_celebrations_slug').on(table.slug), index('idx_celebrations_date_rank').on(table.celebrationDate, table.rank), index('idx_celebrations_season').on(table.season)]);

export const readings = pgTable('readings', {
  id: serial('id').primaryKey(), celebrationId: integer('celebration_id').notNull().references(() => celebrations.id, { onDelete: 'cascade' }),
  readingOrder: integer('reading_order').notNull(), kind: text('kind').notNull(), citation: text('citation').notNull(), excerpt: text('excerpt').notNull(),
}, (table) => [index('idx_readings_celebration_order').on(table.celebrationId, table.readingOrder)]);

export const hymns = pgTable('hymns', {
  id: serial('id').primaryKey(), title: text('title').notNull(), composer: text('composer'), liturgicalPart: text('liturgical_part').notNull(), format: text('format'),
}, (table) => [index('idx_hymns_title').on(table.title)]);

export const celebrationHymns = pgTable('celebration_hymns', {
  celebrationId: integer('celebration_id').notNull().references(() => celebrations.id, { onDelete: 'cascade' }),
  hymnId: integer('hymn_id').notNull().references(() => hymns.id, { onDelete: 'cascade' }), sortOrder: integer('sort_order').notNull().default(0),
}, (table) => [uniqueIndex('idx_celebration_hymns_unique').on(table.celebrationId, table.hymnId)]);
