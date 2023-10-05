import { httpClient } from "../api";
import { Produto } from "../models/produtos"; 
import { AxiosResponse } from 'axios';
import { Page } from "../models/common/page";

const resourceUrl: string = "/api/produtos";

export const useProdutoService = () => {

    const salvar = async (produto: Produto): Promise<Produto> => {
        const response: AxiosResponse<Produto> = await httpClient.post<Produto>(resourceUrl, produto);
        return response.data;
    };

    const atualizar = async (produto: Produto): Promise<void> => {
        const url: string = `${resourceUrl}/${produto.id}`;
        await httpClient.put<Produto>(url, produto);
    };

    const carregaProdutoPorId = async (id: any): Promise<Produto> => {
        const url: string = `${resourceUrl}/${id}`;
        const response: AxiosResponse<Produto> = await httpClient.get<Produto>(url);
        return response.data;
    };

    const deletar = async (id: any): Promise<void> => {
        const url: string = `${resourceUrl}/${id}`;
        await httpClient.delete(url, id);
    };

    const find = async (
        nome: string = '', 
        descricao: string = '', 
        page: number = 0, 
        size: number = 4): Promise<Page<Produto>> => {
            const url = `${resourceUrl}?nome=${nome}&descricao=${descricao}&page=${page}&size=${size}`;
            const response: AxiosResponse<Page<Produto>> = await httpClient.get(url);
            return response.data;
    };

    const listar = async (): Promise<Produto[]> => {
        const url = `${resourceUrl}/autocomplete`;
        const response: AxiosResponse<Produto[]> = await httpClient.get(url);
        return response.data;
    }

    return {
        salvar, 
        atualizar,
        carregaProdutoPorId,
        deletar,
        find,
        listar
    }

}