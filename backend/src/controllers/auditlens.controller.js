// Handles AuditLens proxy requests and persists ingest/query history.
import { AuditLog } from "../models/AuditLog.js";
import { parseAuditLensLogBuffer } from "../services/auditlens/auditlensLogParser.service.js";
import { forwardIngest, forwardQuery, isServiceUnavailable } from "../services/auditlens/auditlensProxy.service.js";
import { ingestRecords } from "../services/ingestion/ingestion.service.js";

export async function ingestAuditLensFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: { message: "File is required" } });
  }

  try {
    const result = await forwardIngest(req.file);
    const records = parseAuditLensLogBuffer(req.file.buffer, req.file.originalname);
    const normalizedResults = records.length
      ? await ingestRecords({
          records,
          sourceType: "auditlens_upload",
          sourceName: req.file.originalname
        })
      : [];
    const output = {
      ...result,
      normalizedEvents: normalizedResults.length
    };

    await AuditLog.create({
      type: "ingest",
      input: req.file.originalname,
      output,
      user: req.user?._id || null
    });

    return res.json(output);
  } catch (error) {
    console.error("AuditLens ingest failed", {
      filename: req.file.originalname,
      message: error.message,
      code: error.code
    });

    if (isServiceUnavailable(error)) {
      return res.status(503).json({ error: { message: "AuditLens service unavailable" } });
    }

    return res.status(error.response?.status || 500).json({
      error: {
        message: error.response?.data?.detail || error.response?.data?.error?.message || "AuditLens ingest failed"
      }
    });
  }
}

export async function queryAuditLens(req, res) {
  const question = req.body?.question;

  if (typeof question !== "string" || question.trim().length === 0) {
    return res.status(400).json({ error: { message: "Question must be a non-empty string" } });
  }

  try {
    const result = await forwardQuery(question.trim());
    await AuditLog.create({
      type: "query",
      input: question.trim(),
      output: result,
      user: req.user?._id || null
    });

    return res.json(result);
  } catch (error) {
    console.error("AuditLens query failed", {
      question: question.trim(),
      message: error.message,
      code: error.code
    });

    if (isServiceUnavailable(error)) {
      return res.status(503).json({ error: { message: "AuditLens service unavailable" } });
    }

    return res.status(error.response?.status || 500).json({
      error: {
        message: error.response?.data?.detail || error.response?.data?.error?.message || "AuditLens query failed"
      }
    });
  }
}

export async function listAuditLensHistory(req, res, next) {
  try {
    const query = {};
    const limit = Math.min(Number.parseInt(req.query.limit, 10) || 50, 200);

    if (["ingest", "query"].includes(req.query.type)) {
      query.type = req.query.type;
    }

    const history = await AuditLog.find(query).sort({ timestamp: -1 }).limit(limit).lean();
    return res.json({ history });
  } catch (error) {
    return next(error);
  }
}
