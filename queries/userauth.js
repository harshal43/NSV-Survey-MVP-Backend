const insertUser = `INSERT INTO public."user"(
	id, username, hashpass, name, email, phone, role, status, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;

const getUserFromUsername = `SELECT id, username, hashpass, name, email, phone, role, status, created_at, updated_at
	FROM public."user" WHERE username = $1 `;
const getUSerFromUserId =`SELECT id, username, hashpass, name, email, phone, role, status, created_at, updated_at
	FROM public."user" WHERE id = $1 `

export { insertUser, getUserFromUsername,getUSerFromUserId };
