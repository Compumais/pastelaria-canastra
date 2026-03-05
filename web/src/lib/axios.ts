import axios from "axios"
import { BASE_URL, PORT } from "@/storage/storage-config";

const delay = true

export const api = axios.create();

api.interceptors.request.use(async (config) => {
  // Configuração dinâmica da baseURL para evitar erro de SSR e permitir mudanças sem reload
  if (typeof window !== "undefined") {
    const baseUrl = localStorage.getItem(BASE_URL) || "127.0.0.1";
    const port = localStorage.getItem(PORT) || 5000;
    config.baseURL = `http://${baseUrl}:${port}`;
  }

  if (delay) {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 3000)),
    )
  }

  return config
})