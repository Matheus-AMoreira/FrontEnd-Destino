import { apiFetch } from "$lib/api";
import type { Pacote } from "$lib/types/pacote";

export async function load({ url, fetch }) {
  const page = url.searchParams.get("page") || "0";

  try {
    const data = await apiFetch<any>(`/pacotes?page=${page}`, {}, fetch);

    return {
      pacotes: data.packages || [],
      totalPaginas: data.total_pages || 0,
      paginaAtual: data.current_page || 0,
    };
  } catch (error) {
    console.error("Erro ao carregar pacotes:", error);
    return {
      pacotes: [],
      totalPaginas: 0,
      paginaAtual: 0,
    };
  }
}
