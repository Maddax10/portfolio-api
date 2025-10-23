DROP VIEW IF EXISTS skills_view;

CREATE VIEW skills_view as
SELECT 
	id_skills as "id",
	name_skills as "name",
	image_path_skills as "image_path"
FROM skills