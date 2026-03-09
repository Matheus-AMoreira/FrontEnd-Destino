export interface Pacote {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  status: string;
  inicio: string;
  fim: string;
  disponibilidade: number;
  tags?: { id: number; nome: string }[];

  fotosDoPacote?: {
    id: number;
    nome: string;
    fotoDoPacote: string;
    fotos?: Array<{
      id: number;
      nome: string;
      url: string;
    }>;
  };

  ofertas: {
    id: number;
    preco: number;
    inicio: string;
    fim: string;
    disponibilidade: number;
    hotel: {
      id: number;
      nome: string;
      endereco: string;
      diaria: number;
      cidade: {
        id: number;
        nome: string;
        estado: {
          id: number;
          sigla: string;
          nome: string;
          regiao: {
            id: number;
            sigla: string;
            nome: string;
          };
        };
      };
    };

    transporte: {
      id: number;
      empresa: string;
      meio: string;
      preco: number;
    };
  }[];
}
