import { useState, useEffect } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import placeholder from "/placeholder.jpg";
import { FaTreeCity } from "react-icons/fa6";
import { FaCalendarAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { MdAirplaneTicket, MdOutlineAirplanemodeActive } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import api from "#/lib/api";
import type { Pacote } from "#/utils/type/Pacote";

export const Route = createFileRoute("/(app)/_app/pacote/$nome")({
  component: PacoteDetalhe,
});

export default function PacoteDetalhe() {
  const { nome } = Route.useParams();
  const navigate = useNavigate();

  const [imagemSelecionada, setImagemSelecionada] = useState<string>("");
  const [ofertaSelecionadaId, setOfertaSelecionadaId] = useState<number | null>(
    null,
  );
  const numeroPessoas = 1;
  const [modalAberto, setModalAberto] = useState(false);

  const { data: pacote, isLoading } = useQuery({
    queryKey: ["pacote", nome],
    queryFn: async () => {
      const nomeCodificado = encodeURIComponent(nome);
      const response = await api.get(
        `/publico/pacote/detalhes/${nomeCodificado}`,
      );
      return response.data as Pacote;
    },
    enabled: !!nome,
  });

  useEffect(() => {
    if (pacote?.fotosDoPacote?.fotoDoPacote) {
      setImagemSelecionada(pacote.fotosDoPacote.fotoDoPacote);
    }
    if (pacote?.ofertas && pacote.ofertas.length > 0 && !ofertaSelecionadaId) {
      setOfertaSelecionadaId(pacote.ofertas[0].id);
    }
  }, [pacote]);

  const ofertaAtual =
    pacote?.ofertas?.find((o) => o.id === ofertaSelecionadaId) ||
    pacote?.ofertas?.[0];

  const calcularPrecoTotal = () => {
    if (!ofertaAtual) return 0;
    return ofertaAtual.preco * numeroPessoas;
  };

  const formatarPreco = (preco: number) => {
    return preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (dataIso: string) => {
    const [ano, mes, dia] = dataIso.split("-"); // yyyy-MM-dd
    return `${dia}/${mes}/${ano}`;
  };

  const handleComprar = () => {
    if (!ofertaAtual) return;
    navigate({
      to: "/checkout",
      state: { pacote, oferta: ofertaAtual } as any,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600 animate-pulse">
          Carregando detalhes da viagem...
        </div>
      </div>
    );
  }

  if (!pacote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Pacote não encontrado
          </h2>
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const todasFotos = [
    { id: -1, url: pacote.fotosDoPacote?.fotoDoPacote, nome: "Principal" },
    ...(pacote.fotosDoPacote?.fotos || []),
  ].filter((f) => f.url);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-gray-500">
                Início
              </Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li>
              <Link
                to="/buscar"
                search={{
                  termo: "",
                  precoMax: 0,
                  page: 0,
                  size: 12,
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                Busca
              </Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li>
              <span className="text-gray-600 font-medium truncate max-w-[200px]">
                {pacote.nome}
              </span>
            </li>
          </ol>
        </nav>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* --- SEÇÃO DE IMAGENS (GALERIA) --- */}
            <div className="space-y-4">
              {/* Imagem Principal Grande */}
              <div
                className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in group relative"
                onClick={() => setModalAberto(true)}
              >
                <img
                  src={
                    imagemSelecionada != "" ? imagemSelecionada : placeholder
                  }
                  alt={pacote.nome}
                  className="w-full h-96 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                    Ver em tela cheia
                  </span>
                </div>
              </div>
              {/* Miniaturas (Slide) */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {todasFotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setImagemSelecionada(foto.url)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      imagemSelecionada === foto.url
                        ? "border-blue-500 opacity-100"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={foto.url}
                      alt={foto.nome}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* --- SEÇÃO DE DETALHES --- */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {pacote.nome}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-1">
                      <FaTreeCity className="text-xl" />
                    </span>
                    <span>
                      {ofertaAtual?.hotel?.cidade?.nome} -{" "}
                      {ofertaAtual?.hotel?.cidade?.estado?.sigla}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">
                      <FaCalendarAlt className="text-xl" />
                    </span>
                    <span>
                      {ofertaAtual ? formatarData(ofertaAtual.inicio) : ""} até{" "}
                      {ofertaAtual ? formatarData(ofertaAtual.fim) : ""}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">
                      <MdOutlineAirplanemodeActive className="text-xl" />
                    </span>
                    <span>
                      {ofertaAtual?.transporte?.meio} (
                      {ofertaAtual?.transporte?.empresa})
                    </span>
                  </div>
                </div>
                {/* Tags */}
                {pacote.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {pacote.tags.map((tagObj, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wide"
                      >
                        {tagObj.nome}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Preço e Pessoas */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-blue-900">
                    {formatarPreco(calcularPrecoTotal())}
                  </span>
                  <span className="text-gray-600 text-sm">
                    / total para {numeroPessoas}
                    {numeroPessoas > 1 ? "pessoas" : "pessoa"}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1 flex items-center">
                  <FaMoneyCheckAlt className="mr-1" /> Preço individual:
                  {ofertaAtual ? formatarPreco(ofertaAtual.preco) : ""}
                </div>
              </div>
              {/* Seleção de Oferta (Data da Viagem) */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  Escolha a data da viagem
                </label>
                <div className="flex flex-col gap-2">
                  {pacote.ofertas?.map((oferta) => (
                    <label
                      key={oferta.id}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                        ofertaSelecionadaId === oferta.id
                          ? "border-blue-500 bg-blue-50/50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="oferta"
                          value={oferta.id}
                          checked={ofertaSelecionadaId === oferta.id}
                          onChange={() => setOfertaSelecionadaId(oferta.id)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatarData(oferta.inicio)} a{" "}
                            {formatarData(oferta.fim)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Hotel: {oferta.hotel?.nome} |{" "}
                            {oferta.transporte?.meio}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatarPreco(oferta.preco)}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {oferta.disponibilidade} vagas
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {/* Controle de Pessoas (BOTÕES DESATIVADOS) */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  Quantos viajantes? (Apenas visual)
                </label>
                <div className="flex items-center space-x-3">
                  <button // onClick removido para desativar a funcionalidade
                    disabled={true} // Desativado conforme solicitado
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">
                    {numeroPessoas}
                  </span>
                  <button // onClick removido para desativar a funcionalidade
                    disabled={true} // Desativado conforme solicitado
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">
                    ({ofertaAtual?.disponibilidade || 0} vagas disponíveis)
                  </span>
                </div>
              </div>
              {/* Botão Comprar */}
              <button
                onClick={handleComprar}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <MdAirplaneTicket className="text-2xl" />
                <span>Reservar Agora</span>
              </button>
              {/* Descrição Curta */}
              <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-gray-900">Sobre o Pacote</h3>
                <p className="text-sm leading-relaxed">{pacote.descricao}</p>
              </div>
            </div>
          </div>
          {/* Detalhes Inferiores */}
          <div className="border-t border-gray-200 px-8 py-8 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Hospedagem
                </h3>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="font-semibold text-blue-800">
                    {ofertaAtual?.hotel?.nome}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Diária média inclusa: R$ {ofertaAtual?.hotel?.diaria}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {ofertaAtual?.hotel?.cidade?.nome},{" "}
                    {ofertaAtual?.hotel?.cidade?.estado?.sigla}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Transporte Incluso
                </h3>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="font-semibold text-blue-800">
                    {ofertaAtual?.transporte?.empresa}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Tipo: {ofertaAtual?.transporte?.meio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- MODAL LIGHTBOX (Tela Cheia) --- */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setModalAberto(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 focus:outline-none"
            onClick={() => setModalAberto(false)}
          >
            &times;
          </button>
          <img
            src={imagemSelecionada}
            alt="Tela cheia"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar na imagem
          />
          {/* Navegação no Modal */}
          <div
            className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {todasFotos.map((foto, index) => (
              <img
                key={index}
                src={foto.url}
                onClick={() => setImagemSelecionada(foto.url)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  imagemSelecionada === foto.url
                    ? "border-white"
                    : "border-transparent opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
