DROP TABLE IF EXISTS "skills";

CREATE TABLE "skills" (
	"id_skills"	INTEGER NOT NULL UNIQUE,
	"name_skills"	TEXT NOT NULL UNIQUE,
	"image_path_skills"	BLOB,
	PRIMARY KEY("id_skills" AUTOINCREMENT)
)