import express from "express";
import { configDotenv } from "dotenv";
import webhookRoutes from "./routes.js";
import morgan from "morgan";
import path from "path";

configDotenv();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan("dev")); // Logs concise request details
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));


// Use modular routes
app.use("/webhook", webhookRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
