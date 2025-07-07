const projectInspection = `SELECT id, project_id, inspection_date, remarks, inspection_by, inspection_duration,created_at
	FROM public.inspection WHERE project_id = $1 ORDER BY Created_at DESC`;

const addInspectionQuery = `INSERT INTO public.inspection(id,
	project_id, inspection_date, remarks, inspection_by, inspection_duration, video_link, created_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
export { projectInspection, addInspectionQuery };
