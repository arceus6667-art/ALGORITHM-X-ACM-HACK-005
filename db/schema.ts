import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const trials = sqliteTable('demo_trials', {
 subject: text('subject').primaryKey(),
 mode: text('mode').notNull(),
 startedAt: integer('started_at').notNull(),
 expiresAt: integer('expires_at').notNull(),
 termsVersion: text('terms_version').notNull(),
});
