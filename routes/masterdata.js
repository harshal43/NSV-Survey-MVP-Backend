import { Router } from "express";
const router = Router();
import { laneData, PiuList, projectDeatils, ProjectList, roList } from "../controllers/masterData.js";

router.get("/ro-list", roList);
router.get("/piu-list", PiuList);
router.get("/project-list", ProjectList);
router.get("/lane_data", laneData);projectDeatils
router.get("/project-details", projectDeatils);



// router.put("/edit/:id", editUser);
    
export default router;
