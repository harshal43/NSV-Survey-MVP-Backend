const projectInspection = `SELECT 
  i.id, 
  i.project_id,
  i.video_link, 
  i.inspection_date, 
  i.remarks, 
  u.name AS inspection_by, -- instead of user ID
  i.inspection_duration, 
  i.created_at
FROM 
  public.inspection i
JOIN 
  public."user" u ON i.inspection_by = u.id
WHERE 
  i.project_id = $1
ORDER BY 
  i.created_at DESC;
`;

const addInspectionQuery = `INSERT INTO public.inspection(id,
	project_id, inspection_date, remarks, inspection_by, inspection_duration, video_link, created_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
export { projectInspection, addInspectionQuery };
