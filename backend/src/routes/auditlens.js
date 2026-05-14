// Defines Express routes that bridge the dashboard to the AuditLens FastAPI service.
import { Router } from "express";
import multer from "multer";
import { ingestAuditLensFile, listAuditLensHistory, queryAuditLens } from "../controllers/auditlens.controller.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(log|txt|json|md|csv)$/i.test(file.originalname);
    cb(allowed ? null : new Error("Unsupported file type"), allowed);
  }
});

router.post("/ingest", upload.single("file"), ingestAuditLensFile);
router.post("/query", queryAuditLens);
router.get("/history", listAuditLensHistory);

router.use((error, _req, res, next) => {
  if (error.message === "Unsupported file type") {
    return res.status(400).json({ error: { message: error.message } });
  }
  return next(error);
});

export default router;
