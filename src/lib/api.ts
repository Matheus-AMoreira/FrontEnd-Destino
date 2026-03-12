import axios from "axios";

const baseURL = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let getToken: () => string | undefined = () => undefined;

export const setTokenGetter = (fn: () => string | undefined) => {
  getToken = fn;
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let handleTokenRefresh: () => Promise<boolean> = async () => false;
let handleLogout: () => void = () => {};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setAuthHandlers = (
  refreshFn: () => Promise<boolean>,
  logoutFn: () => void,
) => {
  handleTokenRefresh = refreshFn;
  handleLogout = logoutFn;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for 401 e a requisição original não for para autenticação ou rota pública
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/") &&
      !originalRequest.url?.includes("auth/") &&
      !originalRequest.url?.includes("/publico/")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = "Bearer " + token;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true; // Previne loop infinito na request original executada
      isRefreshing = true;

      try {
        const success = await handleTokenRefresh();
        if (success) {
          // Token renovado com sucesso, libera a fila e refaz a original
          const newToken = getToken();
          processQueue(null, newToken ?? "");
          return api(originalRequest);
        } else {
          // Falhou a renovação, desloga e rejeita a fila
          processQueue(error, null);
          handleLogout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Falhou a renovação, desloga e rejeita a fila
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
