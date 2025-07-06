import { Router } from "express";
const router = Router();
import userAuth from "../routes/userAuth.js";

router.use("/auth",userAuth);


export default router
