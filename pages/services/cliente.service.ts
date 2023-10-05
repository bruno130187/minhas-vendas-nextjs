import { httpClient } from "../api";
import { Cliente } from "../models/clientes"; 
import { AxiosResponse } from 'axios';
import { Page } from "../models/common/page";

const resourceUrl: string = "/api/clientes";

export const useClienteService = () => {

    const salvar = async (cliente: Cliente): Promise<Cliente> => {
        const response: AxiosResponse<Cliente> = await httpClient.post<Cliente>(resourceUrl, cliente);
        return response.data;
    }

    const atualizar = async (cliente: Cliente): Promise<void> => {
        const url: string = `${resourceUrl}/${cliente.id}`;
        await httpClient.put<Cliente>(url, cliente);
    }

    const carregaClientePorId = async (id: any): Promise<Cliente> => {
        const url: string = `${resourceUrl}/${id}`;
        const response: AxiosResponse<Cliente> = await httpClient.get<Cliente>(url);
        return response.data;
    }

    const deletar = async (id: any): Promise<void> => {
        const url: string = `${resourceUrl}/${id}`;
        await httpClient.delete(url, id);
    }

    const find = async (
        nome: string = '', 
        cpf: string = '', 
        page: number = 0, 
        size: number = 4): Promise<Page<Cliente>> => {
            const url = `${resourceUrl}?nome=${nome}&cpf=${cpf}&page=${page}&size=${size}`;
            const response: AxiosResponse<Page<Cliente>> = await httpClient.get(url);
            return response.data;
    }

    return {
        salvar, 
        atualizar,
        carregaClientePorId,
        deletar,
        find
    }

}