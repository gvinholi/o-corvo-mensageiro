import { Router } from "express";
import { receiveMercadoLivreWebhook } from "../modules/webhooks";

const router = Router();

router.post("/mercadolivre", receiveMercadoLivreWebhook);

export default router;
