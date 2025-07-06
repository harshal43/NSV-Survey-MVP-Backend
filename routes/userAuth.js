import { Router } from "express";
const router = Router();
import { signup, login, editUser } from "../controllers/userAuth.js";

router.post("/signup", signup);
router.post("/login", login);
// router.put("/edit/:id", editUser);
    
export default router;
