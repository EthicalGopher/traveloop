import { getSession } from "./auth";

const API_URL = "http://localhost:8080";

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const session = getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Check if response is empty
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // If not JSON, use the raw text as error or data
    if (!response.ok) {
      throw new Error(text || `Error: ${response.status} ${response.statusText}`);
    }
    return text;
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }

  return data;
};
