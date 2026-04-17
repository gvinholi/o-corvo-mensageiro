import { Router } from "express";
import { usuarioML } from "../controllers/account.controller";

const router = Router();

router.get('/me', usuarioML);

export default router;