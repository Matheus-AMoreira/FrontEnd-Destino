import { PUBLIC_API_URL } from "$env/static/public";

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  customFetch?: Fetcher,
): Promise<T> {
  const url = `${PUBLIC_API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const fetchToUse = customFetch || fetch;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetchToUse(url, {
    ...options,
    headers,
    credentials: "include", // Permite o envio/recebimento de cookies HttpOnly
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(error.message || `Erro na requisição: ${response.status}`);
  }

  return response.json();
}
