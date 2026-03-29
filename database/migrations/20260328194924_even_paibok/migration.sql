CREATE TABLE "nest_egg_configurations" (
  "uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(1020) NOT NULL,
  "description" text,
  "eggs" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
  "config_allocations" jsonb,
  "config_routes" jsonb,
  "created" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "nest_egg_variables" ADD COLUMN "description_translations" jsonb DEFAULT '{}' NOT NULL;

INSERT INTO "nest_egg_configurations" (
  "name", 
  "eggs", 
  "config_allocations"
)
SELECT 
  'Migrated Config for Egg ' || "name"::text AS "name",
  ARRAY["uuid"] AS "eggs",
  "config_allocations"
FROM "nest_eggs"
WHERE "config_allocations"->'user_self_assign'->>'enabled' = 'true';

ALTER TABLE "nest_eggs" DROP COLUMN "config_allocations";