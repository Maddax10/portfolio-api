DROP TABLE IF EXISTS "projects";

CREATE TABLE "projects" (
	"id_projects"	INTEGER NOT NULL UNIQUE,
	"title_projects"	TEXT NOT NULL,
	"description_projects"	TEXT NOT NULL,
	"github_projects"	TEXT NOT NULL,
	"image_path_projects"	TEXT NOT NULL,
	"skills_projects"	TEXT NOT NULL,
	PRIMARY KEY("id_projects" AUTOINCREMENT)
)