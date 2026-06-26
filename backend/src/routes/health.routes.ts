import { Router } from "express";
import { checkServicesHealth } from "../modules/health";

const router = Router();

router.get("/", async (req, res) => {
  const services = await checkServicesHealth();

  res.json({
    status: "ok",
    services,
  });
});

export default router;