DROP VIEW IF EXISTS "projects_view";

CREATE VIEW "projects_view" AS
SELECT 
	id_projects as "id",
	title_projects as "title",
	description_projects as "description",
	github_projects as "github",
	image_path_projects as "image_path",
	skills_projects as "skills"
FROM projects
