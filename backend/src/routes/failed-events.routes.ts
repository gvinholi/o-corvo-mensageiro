import { Router } from "express";
import { listarFalhas } from "../controllers/failed-events.controller";

const router = Router();

router.get("/", listarFalhas);

export default router;
