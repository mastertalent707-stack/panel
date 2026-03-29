ALTER TABLE "nest_egg_configurations" ADD COLUMN "order_" smallint DEFAULT 0 NOT NULL;
ALTER TABLE "egg_repository_eggs" ALTER COLUMN "exported_egg" SET DATA TYPE json USING "exported_egg"::json;
ALTER TABLE "nest_eggs" ALTER COLUMN "docker_images" SET DATA TYPE json USING "docker_images"::json;