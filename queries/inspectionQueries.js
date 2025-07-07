const projectInspection = `SELECT id, project_id, inspection_date, remarks, inspection_by, inspection_duration,created_at
	FROM public.inspection WHERE project_id = $1 ORDER BY Created_at DESC`;
export { projectInspection };
