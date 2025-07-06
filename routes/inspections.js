import { Router } from "express";
import { inspectionData } from "../controllers/inspectionData";
const router = Router();

router.get("/prev-inspection-data",inspectionData );


// router.put("/edit/:id", editUser);
    
export default router;
