import React, { useState } from "react";
import { useFormik } from "formik";
import { Venda, ItemVenda } from "../../models/vendas";
import {
  AutoComplete,
  AutoCompleteChangeParams,
  AutoCompleteCompleteMethodParams,
} from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/components/dialog/Dialog";
import { Dropdown } from 'primereact/dropdown';
import { Page } from "../../models/common/page";
import { Cliente } from "../../models/clientes";
import { useClienteService } from "../../services/cliente.service";
import { useProdutoService } from "../../services/produto.service";
import { Produto } from "../../models/produtos";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { validationSchema } from "./validationSchema";
import RotaAutenticada from "../rotaautenticada";

interface VendasProps {
  onSubmit: (venda: Venda) => void;
  onNovaVenda: () => void;
  vendaRealizada: boolean;
}

const formScheme: Venda = {
  cliente: null,
  itens: [],
  formaPagamento: "",
  total: 0,
};

const VendasForm: React.FC<VendasProps> = ({ onSubmit, onNovaVenda, vendaRealizada }) => {
  const clienteService = useClienteService();
  const produtoService = useProdutoService();
  const [mensagem, setMensagem] = useState<string>("");
  const [quantidadProduto, setQuantidadeProduto] = useState<number>(0);
  const [codigoProduto, setCodigoProduto] = useState<string>("");
  const [produto, setProduto] = useState<Produto>(null);
  const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
    content: [],
    first: 0,
    number: 0,
    size: 0,
    totalElements: 0,
  });
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [listaFiltradaProdutos, setListaFiltradaProdutos] = useState<Produto[]>([]);
  const formasPagamento: String[] = ["DINHEIRO", "PIX", "CARTAO_CREDITO", "BOLETO"];

  const formik = useFormik<Venda>({
    onSubmit,
    initialValues: formScheme,
    validationSchema: validationSchema
  });

  const handleClienteAutocomplete = (e: AutoCompleteCompleteMethodParams) => {
    const nome = e.query;
    clienteService
      .find(nome, "", 0, 20)
      .then((clientes) => setListaClientes(clientes));
  };

  const handleProdutoAutocomplete = async (e: AutoCompleteCompleteMethodParams) => {
    if (!listaProdutos.length) {
      console.log("Listando produtos");
      await produtoService.listar().then((produtosEncontrados => {
        setListaProdutos(produtosEncontrados);
        console.log("produtosEncontrados: ", produtosEncontrados);
      }));
    }
    console.log("listaProdutos: ", listaProdutos);
    const produtosEncontrados = listaProdutos.filter((produto: Produto) => {
      return produto.nome.toUpperCase().includes(e.query.toUpperCase());
    });
    setListaFiltradaProdutos(produtosEncontrados);
  }

  const handleClienteChange = (e: AutoCompleteChangeParams) => {
    const clienteSelecionado: Cliente = e.value;
    console.log("clienteSelecionado: ", clienteSelecionado);
    formik.setFieldValue("cliente", clienteSelecionado);
  };

  const handleProdutoChange = (e: AutoCompleteChangeParams) => {
    const produtoSelecionado: Produto = e.value;
    console.log("produtoSelecionado: ", produtoSelecionado);
    setProduto(produtoSelecionado);
  };

  const handleCodigoProdutoSelect = (event) => {
    if (codigoProduto) {
      produtoService
      .carregaProdutoPorId(codigoProduto)
      .then(produtoEncontrado => {
        setProduto(produtoEncontrado);
      }).catch(err => setMensagem('Produto não encontrado!'));
    }
  };

  const handleAddProduto = () => {
    event.preventDefault();
    const itensJaAdicionados = formik.values.itens;

    const jaExisteOItemNaVenda = itensJaAdicionados.some((itemVenda: ItemVenda) => {
      return itemVenda.produto.id === produto.id;
    });

    if (jaExisteOItemNaVenda) {
      itensJaAdicionados.forEach((itemVenda: ItemVenda) => {
        if (itemVenda.produto.id === produto.id) {
          itemVenda.quantidade += quantidadProduto;
        }
      })
    } else {
      itensJaAdicionados.push({
        produto: produto,
        quantidade: quantidadProduto
      });
      console.log(itensJaAdicionados);
    }
    
    setProduto(null);
    setCodigoProduto('');
    setQuantidadeProduto(0);

    const total = totalVenda();
    formik.setFieldValue("total", formatCurrency(total));
  }

  const handleDialogProdutoNaoEncontrado = () => {
    setProduto(null);
    setCodigoProduto('');
    setMensagem('');
  }

  const footerDialog = (
    <div>
        <button type="button" onClick={handleDialogProdutoNaoEncontrado} className="button is-link mt-3">
          Ok
        </button>
    </div>
  );

  const disableAddProdutoButton = () => {
    return !produto || !quantidadProduto || !formik.values.cliente
  }

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const priceBodyTemplate = (produto) => {
    console.log("produto: ", produto);
    return formatCurrency(produto.produto.preco);
  };

  const totalVenda = () => {
    const totais: number[] = formik.values.itens?.map(itemVenda => itemVenda.quantidade * parseFloat(itemVenda.produto.preco.toString()));
    if (totais.length) {
      return totais.reduce((somatoriaAtual = 0, valorItemAtual) => somatoriaAtual + valorItemAtual);
    } else {
      return 0;
    }
  }

  const realizarNovaVenda = () => {
    onNovaVenda();
    formik.resetForm();
    formik.setFieldValue("itens", []);
    formik.setFieldTouched("itens", false);
  }

  return (
    <RotaAutenticada>
      <form onSubmit={formik.handleSubmit}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="cliente">Cliente: *</label>
            <AutoComplete
              id="cliente"
              name="cliente"
              value={formik.values.cliente}
              field="nome"
              suggestions={listaClientes.content}
              completeMethod={handleClienteAutocomplete}
              onChange={handleClienteChange}
            />
            <small className="p-error p-d-block">
              {formik.errors.cliente}
            </small>
          </div>
          <div className="p-grid">
            <div className="p-col-2">
              <span className="p-float-label mt-3">
                <InputText
                  id="codigoProduto"
                  onBlur={handleCodigoProdutoSelect}
                  value={codigoProduto}
                  onChange={(e) => setCodigoProduto(e.target.value)}
                />
                <label htmlFor="codigoProduto">Código: *</label>
              </span>
            </div>
            <div className="p-col-6">
              <span className="p-float-label mt-3">
                <AutoComplete
                  id="produto"
                  name="produto"
                  suggestions={listaFiltradaProdutos} 
                  completeMethod={handleProdutoAutocomplete}
                  value={produto}
                  field="nome"
                  onChange={handleProdutoChange}
                />
                <label htmlFor="produto">Produto: *</label>
              </span>
            </div>
            <div className="p-col-2">
              <div className="p-field">
              <span className="p-float-label mt-3">
                <InputText
                  id="qtdProduto"
                  value={quantidadProduto}
                  onChange={e => setQuantidadeProduto(parseInt(e.target.value))}
                />
                <label htmlFor="qtdProduto">QTD: *</label>
              </span>
              </div>
            </div>
            <div className="p-col-2">
              <div className="p-field">
                <button type="button" onClick={handleAddProduto} disabled={disableAddProdutoButton()} className="button is-link mt-3 is-fullwidth">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
          <div className="p-col-12">
            <DataTable 
              value={formik.values.itens} 
              className="is-fullwidth" 
              emptyMessage="Nenhum dado inserido."
              lazy={true}
              resizableColumns={true}
              >
              <Column field="produto.id" header="Código" />
              <Column field="produto.sku" header="SKU" />
              <Column field="produto.nome" header="Produto" />
              <Column field="produto.preco" header="Preço Unitário" body={priceBodyTemplate} />
              <Column field="quantidade" header="QTD" />
              <Column header="Preço Total" body={(itemVenda: ItemVenda) => {
                return (
                  <div>
                    {formatCurrency(parseFloat(itemVenda.produto.preco.toString()) * itemVenda.quantidade)}
                  </div>
                );
              }} />
              <Column body={(itemVenda: ItemVenda) => {
                const handleRemoverItem = () => {
                  const novaLista = formik.values.itens.filter(iv => iv.produto.id !== itemVenda.produto.id);
                  console.log("Item removido: ", itemVenda.produto);
                  formik.setFieldValue("itens", novaLista);
                  if (formik.values.itens.length === 0) {
                    formik.setFieldValue("total", "");
                  } else {
                    const total = totalVenda();
                    console.log("total: ", total);
                    formik.setFieldValue("total", formatCurrency(total));
                  }
                };
                
                return (
                  <button type="button" onClick={handleRemoverItem} className="button is-link w-[80px] is-small">
                    Remover
                  </button>
                );
              }} />
            </DataTable>
            <small className="p-error p-d-block">
              {formik.touched && formik.errors.itens}
            </small>
          </div>
          <div className="p-grid">
            <div className="p-col-5">
                <div className="p-field">
                  <label htmlFor="formaPagamento">Forma de pagamento: *</label>
                  <Dropdown 
                    id="formaPagamento"
                    options={formasPagamento}
                    value={formik.values.formaPagamento}
                    placeholder="Selecione"
                    onChange={e => formik.setFieldValue("formaPagamento", e.value)}
                  />
                  <small className="p-error p-d-block">
                    {formik.touched && formik.errors.formaPagamento}
                  </small>
                </div>
            </div>
            <div className="p-col-2">
                <div className="p-field">
                  <label htmlFor="itens">Itens: </label>
                  <InputText disabled value={formik.values.itens?.length}/>
                </div>
            </div>
            <div className="p-col-2">
                <div className="p-field">
                  <label htmlFor="total">Total: </label>
                  <InputText disabled value={formik.values.total}/>
                </div>
            </div>
          </div>
        </div>
        {!vendaRealizada &&
          <button type="submit" className="button is-link is-fullwidth">
            Finalizar
          </button>
        }
        {vendaRealizada && 
          <button type="button" onClick={realizarNovaVenda} className="button is-primary is-fullwidth">
            Nova Venda
          </button>
        }
        <Dialog 
          header="Atenção!" 
          position="top" 
          visible={!!mensagem} 
          onHide={handleDialogProdutoNaoEncontrado}footerDialog
          footer={footerDialog}
          >
          <p className="m-0">
            {mensagem}
          </p>
        </Dialog>
      </form>
    </RotaAutenticada>
  );
};

export default VendasForm;
