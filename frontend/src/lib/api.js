import axios from "axios";

const defaultApiBaseUrl = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";

function normalizeApiBaseUrl(value) {
  const rawValue = (value || defaultApiBaseUrl).trim().replace(/\/+$/, "");

  if (!rawValue || rawValue === ".") return defaultApiBaseUrl;
  if (rawValue === "/") return "/api";
  if (rawValue === "/api" || rawValue.endsWith("/api")) return rawValue;

  try {
    const parsedUrl = new URL(rawValue, window.location.origin);
    if (parsedUrl.pathname === "/" || parsedUrl.pathname === "") {
      return `${rawValue}/api`;
    }
  } catch {
    return rawValue;
  }

  return rawValue;
}

export const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: apiBaseUrl
});

export async function parseApiResponse(response) {
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || data?.detail || text || `Request failed with status ${response.status}`);
  }

  return data;
}
