const API_HOST =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4000";

export function apiUrl(path: string) {
  return `${API_HOST}${path.startsWith("/") ? path : `/${path}`}`;
}
