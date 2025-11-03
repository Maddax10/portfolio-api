DROP VIEW IF EXISTS "main"."users_view";
CREATE VIEW "users_view" as
SELECT 
u.id_users as "id",
u.mail_users as "mail",
u.createdAt_users as "createdAt",
r.role_roles as "role"
FROM users as u 
JOIN roles as r
WHERE r.id_roles = u.role_users