import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import eventRoutes from "./routes/event.routes";
import eventsRoutes from "./routes/events.routes";
import accountRoutes from "./routes/account.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/events", eventRoutes);
app.use("/api/events", eventsRoutes);
app.use("/account", accountRoutes);

export default app;