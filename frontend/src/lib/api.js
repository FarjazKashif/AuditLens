import axios from "axios";

export const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
