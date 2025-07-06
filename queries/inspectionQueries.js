const projectInspection = `SELECT id, project_id, inspection_date, remarks, inspection_by, inspection_duration
	FROM public.inspection WHERE project_id = $1`;
export { projectInspection };
