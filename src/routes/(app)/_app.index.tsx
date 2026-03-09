import Card from "#/components/landingPage/Card";
import type { Pacote } from "#/utils/type/Pacote";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import api from "#/lib/api";

export const Route = createFileRoute("/(app)/_app/")({ component: App });

function App() {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const ITENS_POR_PAGINA = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["pacotes", paginaAtual],
    queryFn: async () => {
      const response = await api.get("/publico/pacote", {
        params: {
          page: paginaAtual,
          size: ITENS_POR_PAGINA,
        },
      });
      return response.data;
    },
  });
  console.log(data);
  const pacotes: Pacote[] = data || [];
  const totalPaginas = data?.totalPages || 0;
  const handleSearchSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    navigate({
      to: "/buscar",
      search: {
        termo: termoBusca,
        page: 0,
        size: 12,
        precoMax: 0,
      },
    });
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas - 1) setPaginaAtual((prev) => prev + 1);
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 0) setPaginaAtual((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-center bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff]">
      <main className="grow p-4 md:p-8">
        {/* ... [Seção de destaque] ... */}
        <section className="flex flex-wrap items-center pt-4 gap-8">
          <div className="flex flex-col w-full xl:w-[48%] mb-4">
            <h1 className="text-center md:text-left text-4xl lg:text-5xl font-extrabold pt-3 mb-4 px-4">
              O Mundo Todo em Suas Mãos
            </h1>
            <div className="text-lg p-4 md:px-8">
              <p>
                Planeje a jornada dos seus sonhos sem complicações. Descubra
                roteiros exclusivos, personalize cada detalhe e acesse pacotes
                de viagem inesquecíveis.
              </p>
            </div>
            <div className="px-4 md:px-8 flex justify-center md:justify-start mt-6">
              <Link
                to="/buscar"
                search={{
                  termo: "",
                  precoMax: 0,
                  page: 0,
                  size: 12,
                }}
                className="bg-[#2071b3] text-white py-3 px-8 rounded-lg shadow-lg transition duration-300 hover:bg-blue-800"
              >
                Comece a Planejar
              </Link>
            </div>
          </div>
          <div className="flex justify-center w-full xl:w-[48%] mt-8 xl:mt-0">
            <img
              className="rounded-3xl w-full max-w-xgg shadow-xl"
              src="/destaque.jpg"
              alt="Destaque"
            />
          </div>
        </section>

        <hr className="my-9 border-t-2 border-sky-300/50" />

        <section className="mt-7">
          <h2 className="text-center text-4xl font-bold mb-9">
            Confira Nossos Pacotes
          </h2>

          <div className="mb-8 max-w-2xl mx-auto px-4">
            <div className="flex items-center text-lg font-semibold text-gray-700 mb-2 space-x-2 justify-center">
              <MdOutlineTravelExplore className="text-xl" />
              <span>Procurar Viagens</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  placeholder="Ex.: Pacote Fernando de Noronha"
                  className="w-full pl-12 pr-6 py-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-500 outline-none text-lg text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="bg-[#2071b3] text-white py-3 px-6 rounded-xl shadow-lg transition duration-300 hover:bg-blue-800 font-semibold"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* Grid de Cards */}
          <div className="flex justify-center gap-6 flex-wrap px-4 pb-8">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500 text-xl animate-pulse w-full">
                Carregando pacotes...
              </div>
            ) : pacotes.length > 0 ? (
              pacotes.map((data) => (
                <Card
                  key={data.id}
                  title={data.nome}
                  description={data.descricao}
                  imageUrl={data.fotosDoPacote?.fotoDoPacote || "placeholder"}
                  detalhar={() => {
                    navigate({
                      to: "/pacote/$nome",
                      params: {
                        nome: data.nome,
                      },
                    });
                  }}
                />
              ))
            ) : (
              <p className="text-gray-500 text-lg w-full text-center">
                Nenhum pacote disponível no momento.
              </p>
            )}
          </div>

          {/* Componente de Paginação */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4 mb-8">
              <button
                onClick={handlePaginaAnterior}
                disabled={paginaAtual === 0}
                className={`p-3 rounded-full shadow-md transition ${
                  paginaAtual === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-[#2071b3] hover:bg-[#2071b3] hover:text-white"
                }`}
              >
                <FaChevronLeft />
              </button>

              <span className="text-lg font-medium text-gray-700">
                Página {paginaAtual + 1} de {totalPaginas}
              </span>

              <button
                onClick={handleProximaPagina}
                disabled={paginaAtual === totalPaginas - 1}
                className={`p-3 rounded-full shadow-md transition ${
                  paginaAtual === totalPaginas - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-[#2071b3] hover:bg-[#2071b3] hover:text-white"
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
