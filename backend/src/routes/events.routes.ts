import { Router } from "express";
import { listarEventos } from "../controllers/events.controller";

const router = Router();

router.get("/", listarEventos);

export default router;
