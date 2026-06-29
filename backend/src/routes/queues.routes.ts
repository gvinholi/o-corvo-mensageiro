import { Router } from "express";
import { listarFilas } from "../controllers/queues.controller";

const router = Router();

router.get("/", listarFilas);

export default router;
