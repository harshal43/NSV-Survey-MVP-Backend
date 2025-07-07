const getRoList = `SELECT id, ro_name, ro_resp, email, phone, state, address, pincode, created_at, updated_at
	FROM public.ro_master;`;
const getPiuList = `SELECT id, piu_name, address, email, phone, pd_name, pincode, created_at, updated_at, ro_id_fk
	FROM public.piu_master WHERE ro_id_fk = $1`;
const getProjectList = `SELECT id, project_name, upc, piu_id_fk, survey_date, year, cycle, concessionaire, completion_year, mode, length, "ae/ie"
	FROM public.projects WHERE piu_id_fk = $1 ORDER BY year DESC`;
const getLaneData = `SELECT id, project_id, lane_code, lane_number, side
	FROM public.lanes WHERE project_id = $1`;
const getProjectDeatils = `SELECT id, nh_number,project_name, upc, piu_id_fk, survey_date, year, cycle, concessionaire, completion_year, mode, length, "ae/ie"
	FROM public.projects WHERE id = $1`;
export {
  getRoList,
  getPiuList,
  getProjectList,
  getLaneData,
  getProjectDeatils,
};
