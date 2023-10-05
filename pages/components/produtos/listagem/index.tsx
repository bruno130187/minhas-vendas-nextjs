import InputCliente, { InputCPF } from "../../common/input/inputCliente";
import Layout from "../../layout";
import { useFormik } from "formik";
import Link from "next/link";
import { DataTable, DataTablePageParams } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { Tooltip } from "primereact/tooltip";
import { useState, useEffect, useRef } from "react";
import { Page } from "../../../models/common/page";
import { useProdutoService } from "../../../services/produto.service";
import Router from "next/router";
import { useRouter } from "next/router";
import { Alert } from "../../common/message";
import { Produto } from "../../../models/produtos";
import RotaAutenticada from "../../rotaautenticada";

interface ConsultaProdutoForm {
  nome?: string;
  descricao?: string;
}

const ListagemProdutos: React.FC = () => {
  const service = useProdutoService();
  const router = useRouter();
  const tooltipRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<Alert>>([]);
  const [produtos, setProdutos] = useState<Page<Produto>>({
    content: [],
    first: 0,
    number: 0,
    size: 0,
    totalElements: 0,
  });

  const options = {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const formatNumber = new Intl.NumberFormat("pt-BR", options);

  const handlePage = (event: DataTablePageParams) => {
    setLoading(true);
    service
      .find(filtro.nome, filtro.descricao, event?.page, event?.rows)
      .then((result) => {
        setProdutos({ ...result, first: event?.first });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handlePage(null);
    tooltipRef.current && tooltipRef.current.updateTargetEvents();
  }, []);

  const handleSubmit = (filtro: ConsultaProdutoForm) => {
    handlePage(null);
  };

  const acceptConfirmExclusao = (produto: Produto) => {
    service.deletar(produto.id).then((result) => {
      setMessages([
        {
          tipo: "is-success",
          texto: "Produto deletado com sucesso!",
        },
      ]);
      handlePage(null);
    });
  };

  const actionTemplate = (registro: Produto) => {
    const url = `/components/produtos/cadastro?id=${registro.id}`;
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
                    message: `Confirma a exclusão do produto: ${registro.nome} ?`,
                    header: "Confirmação",
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
  } = useFormik<ConsultaProdutoForm>({
    onSubmit: handleSubmit,
    initialValues: {
      nome: "",
      descricao: "",
    },
  });

  const handleRefresh = () => {
    router.reload();
  };

  const resetForm = () => {
    formikReset();
    handleRefresh();
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
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
  };

  const priceBodyTemplate = (produto) => {
    return formatCurrency(produto.preco);
  };

  const descricaoBodyTemplate = (rowData) => {
    return (
      <div>
        <span className="p-t-descricao" data-pr-tooltip={rowData.descricao}>
          {formatCapitalize(formatQuantidadeCaracteres(rowData.descricao, 15))}
        </span>
      </div>
    );
  };

  const nomeBodyTemplate = (produto) => {
    return formatCapitalize(produto.nome);
  };

  return (
    <Layout titulo="Listagem de Produtos" mensagens={messages}>
      <form id="fomrProduto" name="formProduto" onSubmit={formikSubmit}>
        <div className="columns">
          <InputCliente
            id="nome"
            name="nome"
            label="Nome"
            columnClasses="is-half"
            value={filtro.nome}
            onChange={formikChange}
          />

          <InputCPF
            id="descricao"
            name="descricao"
            label="Descrição"
            columnClasses="is-half"
            value={filtro.descricao}
            onChange={formikChange}
          />
        </div>
        <div className="field has-addons">
          <div className="control">
            <Link href="/components/produtos/cadastro">
              <button className="button is-link">Novo</button>
            </Link>
          </div>
          <div className="control">
            <button
              className="button is-light"
              onClick={(e) => resetForm()}
              type="reset"
            >
              Limpar
            </button>
          </div>
          <div className="control ">
            <button className="button is-success is-fullwidth" type="submit">
              Pesquisar
            </button>
          </div>
        </div>
      </form>
      <br />
      <div className="columns">
        <div className="is-full">
          <Tooltip ref={tooltipRef} target=".p-t-descricao"></Tooltip>
          <DataTable
            value={produtos.content}
            totalRecords={produtos.totalElements}
            lazy={true}
            paginator={true}
            first={produtos.first}
            rows={produtos.size}
            onPage={handlePage}
            loading={loading}
            resizableColumns={true}
            emptyMessage="Nenhum registro!"
          >
            <Column field="id" header="ID" style={{ width: "45px" }} />
            <Column field="nome" header="Nome" body={nomeBodyTemplate} />
            <Column
              field="descricao"
              header="Descricao"
              body={descricaoBodyTemplate}
            />
            <Column field="preco" header="Preço" body={priceBodyTemplate} />
            <Column field="sku" header="SKU" />
            <Column field="dataCadastro" header="Data Cadastro" />
            <Column body={actionTemplate} style={{ width: "140px" }} />
          </DataTable>
        </div>
      </div>
    </Layout>
  );
};

export default ListagemProdutos;
