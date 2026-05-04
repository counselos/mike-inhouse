import "dotenv/config";
import express from "express";
import cors from "cors";
import { chatRouter } from "./routes/chat";
import { projectsRouter } from "./routes/projects";
import { projectChatRouter } from "./routes/projectChat";
import { documentsRouter } from "./routes/documents";
import { tabularRouter } from "./routes/tabular";
import { workflowsRouter } from "./routes/workflows";
import { userRouter } from "./routes/user";
import { downloadsRouter } from "./routes/downloads";

function assertRequiredEnv(): void {
  const missing: string[] = [];
  const secret = process.env.DOWNLOAD_SIGNING_SECRET;
  if (!secret || secret.length < 32) {
    missing.push("DOWNLOAD_SIGNING_SECRET (minimum 32 characters)");
  }

  if (missing.length) {
    const lines = [
      "Mike-InHouse cannot start: required env vars are not set.",
      "",
      ...missing.map((name) => `- ${name}`),
      "",
      "Generate a download signing secret with:",
      "  openssl rand -hex 32",
      "",
      "Then add it to backend/.env:",
      "  DOWNLOAD_SIGNING_SECRET=<generated-value>",
    ];
    // eslint-disable-next-line no-console
    console.error(lines.join("\n"));
    process.exit(1);
  }
}

assertRequiredEnv();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));

app.use("/chat", chatRouter);
app.use("/projects", projectsRouter);
app.use("/projects/:projectId/chat", projectChatRouter);
app.use("/single-documents", documentsRouter);
app.use("/tabular-review", tabularRouter);
app.use("/workflows", workflowsRouter);
app.use("/user", userRouter);
app.use("/users", userRouter);
app.use("/download", downloadsRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Mike backend running on port ${PORT}`);
});
