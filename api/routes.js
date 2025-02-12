import express from "express";
import { handleUserMessage, handleWebhookVerifcation } from "./services.js";

const router = express.Router();

router.get("/", handleWebhookVerifcation);

router.post("/", handleUserMessage);

export default router;
