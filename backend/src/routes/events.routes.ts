import { Router } from "express";
import {
  buscarEventoPorId,
  listarEventos,
} from "../controllers/events.controller";

const router = Router();

router.get("/", listarEventos);
router.get("/:id", buscarEventoPorId);

export default router;
