import { Router } from "express";
const router = Router();
import userAuth from "../routes/userAuth.js";
import distreses from "../routes/distressData.js";
import masterData from "../routes/masterdata.js";
import inspections from "../routes/inspections.js";




router.use("/auth",userAuth);
router.use("/master",masterData);
router.use("/distresses",distreses);
router.use("/inspections",inspections);





export default router
