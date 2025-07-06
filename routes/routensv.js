import { Router } from "express";
const router = Router();
import userAuth from "../routes/userAuth.js";
import masterData from "../routes/masterdata.js";


router.use("/auth",userAuth);
router.use("/master",masterData);



export default router
