import { Router } from "express";
const router = Router();
import { signup, login, editUser } from "../controllers/userAuth.js";

router.get("/ro-list", signup);
router.get("/piu-list", login);
router.get("/project-list", login);

// router.put("/edit/:id", editUser);
    
export default router;
