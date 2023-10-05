import { AxiosResponse } from "axios";
import { Venda } from "../models/vendas";
import { httpClient } from "../api";

const resourceUrl: string = "/api/vendas";

export const useVendaService = () => {

    const realizarVenda = async (venda: Venda): Promise<void> => {
        await httpClient.post<Venda>(resourceUrl, venda);
    }

    const gerarRelatorioVendas = async (
        idCliente: string = '', 
        dataInicio: string = '', 
        dataFim: string = ''
        ): Promise<Blob> => {
            const url = `${resourceUrl}/relatorio-vendas?id=${idCliente}&inicio=${dataInicio}&fim=${dataFim}`;
            console.log("url: ", url);
            const response: AxiosResponse = await httpClient.get(url, {responseType: 'blob'});
            const bytes =  response.data;
            return new Blob([bytes], {type: 'application/pdf'});
        }

    return {
        realizarVenda,
        gerarRelatorioVendas
    }

}