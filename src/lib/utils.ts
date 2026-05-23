export const formatarData = (dataIso: string) => {
    if (!dataIso) {
        return '';
    }

    const dataApenas = dataIso.includes('T') ? dataIso.split('T')[0] : dataIso;
    const [ano, mes, dia] = dataApenas.split('-');

    return `${dia}/${mes}/${ano}`;
};

export const formatarPreco = (preco: number | undefined | null) => {
    if (preco === undefined || preco === null) return 'R$ 0,00';
    return preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};
