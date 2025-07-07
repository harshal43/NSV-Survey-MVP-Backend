const projectInspection = `SELECT id, project_id,video_link, inspection_date, remarks, inspection_by, inspection_duration,created_at
	FROM public.inspection WHERE project_id = $1 ORDER BY Created_at DESC`;

const addInspectionQuery = `SELECT 
  i.id,
  i.project_id,
  i.inspection_date,
  i.remarks,
  u.name AS inspection_by,
  i.inspection_duration,
  i.video_link,
  i.created_at
FROM 
  public.inspection i
JOIN 
  public."user" u ON i.inspection_by = u.id;
`;
export { projectInspection, addInspectionQuery };
