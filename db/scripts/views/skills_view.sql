DROP VIEW IF EXISTS "main"."skills_view";
CREATE VIEW skills_view as
SELECT 
	id_skills as "id",
	name_skills as "name",
	description_skills as "description",
	image_path_skills as "image_path"
FROM skills