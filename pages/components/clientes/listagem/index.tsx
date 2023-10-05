import InputCliente, { InputCPF } from "../../common/input/inputCliente";
import Layout from "../../layout";
import { useFormik } from "formik";
import Link from "next/link";
import { DataTable, DataTablePageParams } from 'primereact/datatable';
import { Column } from "primereact/column";
import { confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from "primereact/tooltip";
import { useState, useEffect, useRef } from "react";
import { Cliente } from "../../../models/clientes";
import { Page } from "../../../models/common/page";
import { useClienteService } from "../../../services/cliente.service";
import Router from "next/router";
import { useRouter } from "next/router";
import { Alert } from '../../common/message';
import RotaAutenticada from "../../rotaautenticada";

interface ConsultaClienteForm {
    nome?: string;
    cpf?: string;
}

const ListagemClientes: React.FC = () => {

    const service = useClienteService();
    const router = useRouter();
    const tooltipRef = useRef(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ messages, setMessages ] = useState<Array<Alert>>([]);
    const [ clientes, setClientes ] = useState<Page<Cliente>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    });

    const handlePage = (event: DataTablePageParams) => {
        setLoading(true);
        service.find(
            filtro.nome,
            filtro.cpf,
            event?.page,
            event?.rows
        ).then(result => {
            setClientes({...result, first: event?.first});
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        handlePage(null);
        tooltipRef.current && tooltipRef.current.updateTargetEvents();
    }, []);

    const handleSubmit = (filtro: ConsultaClienteForm) => {
        handlePage(null);
    }

    const acceptConfirmExclusao = (cliente: Cliente) => {
        service.deletar(cliente.id)
               .then(result => {
                    setMessages([{
                        tipo: "is-success",
                        texto: "Cliente deletado com sucesso!"
                    }]);
                    handlePage(null);
               });
    }

    const actionTemplate = (registro: Cliente) => {

      const url = `/components/clientes/cadastro?id=${registro.id}`;

      return (
        <RotaAutenticada>
            <div>
            <div className="field has-addons">
                <div className="control">
                <button
                    className="button is-link is-small is-half"
                    onClick={(e) => Router.push(url)}
                    type="button"
                >
                    Editar
                </button>
                </div>
                <div className="control ">
                <button 
                    className="button is-danger is-small is-half" 
                    type="button"
                    onClick={() => {
                        confirmDialog({
                            message: `Confirma a exclusão do cliente com CPF: ${registro.cpf} ?`,
                            header: 'Confirmação',
                            acceptLabel: "Sim",
                            rejectLabel: "Não",
                            accept: () => acceptConfirmExclusao(registro),
                        });
                    }}
                >
                    Deletar
                </button>
                </div>
            </div>
            </div>
        </RotaAutenticada>         
      );
    };

    const { 
        handleSubmit: formikSubmit,
        handleChange: formikChange,
        values: filtro,
        resetForm: formikReset,
     } = useFormik<ConsultaClienteForm>({
        onSubmit: handleSubmit,
        initialValues: {
            nome: '',
            cpf: ''
        }
    });

    const handleRefresh = () => {
        router.reload();
    };

    const resetForm = () => {
      formikReset();
      handleRefresh();
    };

    const formatQuantidadeCaracteres = (value, quantidade) => {
        return value.substring(0, quantidade) + "...";
    };

    const formatCapitalize = (value) => {
        const arr = value.toLowerCase().split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        const str2 = arr.join(" ");
        return str2;
    }

    const enderecoBodyTemplate = (rowData) => {
        return (
          <div>
            <span className="p-t-endereco" data-pr-tooltip={rowData.endereco}>
              {formatCapitalize(formatQuantidadeCaracteres(rowData.endereco, 15))}
            </span>
          </div>
        );
      };

    const nomeBodyTemplate = (cliente) => {
        return formatCapitalize(cliente.nome);
    };

    return (
        <Layout titulo="Listagem de Clientes" mensagens={messages}>
            <form onSubmit={formikSubmit}>
                <div className="columns">
                    <InputCliente id="nome" 
                                  name="nome" 
                                  label="Nome"
                                  columnClasses="is-half" 
                                  value={filtro.nome}
                                  onChange={formikChange}/>

                    <InputCPF id="cpf" 
                                  name="cpf" 
                                  label="CPF"
                                  columnClasses="is-half" 
                                  value={filtro.cpf}
                                  onChange={formikChange}/>              
                </div>
                <div className="field has-addons">
                    <div className="control">
                        <Link href="/components/clientes/cadastro">
                            <button className="button is-link">Novo</button>
                        </Link>
                    </div>
                    <div className="control">
                        <button className="button is-light" onClick={e => resetForm()} type="reset">Limpar</button>
                    </div>
                    <div className="control ">
                        <button className="button is-success is-fullwidth" type="submit">Pesquisar</button>
                    </div>
                </div>
            </form>
            <br />
            <div className="columns">
                <div className="is-full">
                <Tooltip ref={tooltipRef} target=".p-t-endereco"></Tooltip>
                    <DataTable value={clientes.content} 
                               totalRecords={clientes.totalElements}
                               lazy={true}
                               paginator={true}
                               first={clientes.first}
                               rows={clientes.size}
                               onPage={handlePage}
                               loading={loading}
                               resizableColumns={true}
                               emptyMessage="Nenhum registro!">
                        <Column field="id" header="ID" style={{width: '45px'}}/>
                        <Column field="nome" header="Nome" body={nomeBodyTemplate} />
                        <Column field="cpf" header="CPF" />
                        <Column field="nascimento" header="Nascimento" />
                        <Column field="telefone" header="Telefone" />
                        <Column field="email" header="Email" />
                        <Column field="endereco" header="Endereço" body={enderecoBodyTemplate}/>
                        <Column  body={actionTemplate} style={{width: '140px'}}/>
                    </DataTable>
                </div>
            </div>
        </Layout>
    );
}

export default ListagemClientes;