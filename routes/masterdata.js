import { Router } from "express";
const router = Router();
import { PiuList, ProjectList, roList } from "../controllers/masterData.js";

router.get("/ro-list", roList);
router.get("/piu-list", PiuList);
router.get("/project-list", ProjectList);

// router.put("/edit/:id", editUser);
    
export default router;
