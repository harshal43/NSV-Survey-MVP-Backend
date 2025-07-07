import { Router } from "express";
import { addInspection, inspectionData } from "../controllers/inspectionData.js";
const router = Router();

router.get("/prev-inspection-data",inspectionData );
router.post("/add-inspection",addInspection );



// router.put("/edit/:id", editUser);
    
export default router;
