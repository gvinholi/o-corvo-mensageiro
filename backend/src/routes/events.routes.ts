import { Router } from "express";
import {
  atualizarStatusEvento,
  buscarEventoPorId,
  listarEventos,
} from "../controllers/events.controller";

const router = Router();

router.get("/", listarEventos);
router.get("/:id", buscarEventoPorId);
router.patch("/:id/status", atualizarStatusEvento);

export default router;
