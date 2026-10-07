CREATE TABLE `demo_trials` (
	`subject` text PRIMARY KEY NOT NULL,
	`mode` text NOT NULL,
	`started_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`terms_version` text NOT NULL
);
