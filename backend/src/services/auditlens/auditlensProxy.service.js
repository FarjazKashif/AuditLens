// Proxies AuditLens requests from Express to the internal FastAPI service.
import axios from "axios";
import FormData from "form-data";

const auditLensBaseUrl = process.env.AUDITLENS_URL || "http://127.0.0.1:8000";

export async function forwardIngest(file) {
  const form = new FormData();
  form.append("file", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype
  });

  const response = await axios.post(`${auditLensBaseUrl}/ingest`, form, {
    headers: form.getHeaders(),
    timeout: 120000
  });

  return response.data;
}

export async function forwardQuery(question) {
  const response = await axios.post(
    `${auditLensBaseUrl}/query`,
    { question },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 120000
    }
  );

  return response.data;
}

export function isServiceUnavailable(error) {
  return ["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENOTFOUND"].includes(error.code);
}
