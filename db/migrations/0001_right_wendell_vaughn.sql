ALTER TABLE "game_result" DROP CONSTRAINT IF EXISTS "game_result_date_format_check";--> statement-breakpoint
ALTER TABLE "user_stats" DROP CONSTRAINT IF EXISTS "user_stats_last_played_date_format_check";--> statement-breakpoint
ALTER TABLE "game_result" ADD CONSTRAINT "game_result_date_format_check" CHECK ("game_result"."date" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$');--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_last_played_date_format_check" CHECK ("user_stats"."last_played_date" IS NULL OR "user_stats"."last_played_date" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
