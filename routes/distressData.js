import { Router } from "express";
import { getDistressData, getFullSegment, insertDistressSegment } from "../controllers/distressGeoController.js";
const router = Router();

router.post("/distress-data", getDistressData);

router.post("/add-distress-data", insertDistressSegment);
router.get("/project-full-distress", getFullSegment);



// router.put("/edit/:id", editUser);
    
export default router;
