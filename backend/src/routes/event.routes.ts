import { Router } from "express";
import { listarPerguntas } from "../controllers/event.controller";

const router = Router();

router.get("/perguntas", listarPerguntas);

export default router;