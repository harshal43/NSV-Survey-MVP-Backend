import { Router } from "express";
import { getDistressData } from "../controllers/distressGeoController.js";
const router = Router();

router.post("/distress-data", getDistressData);


// router.put("/edit/:id", editUser);
    
export default router;
