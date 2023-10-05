import { number } from "yup";
import Layout from "../../layout";
import { useFormik } from "formik";
import {
  AutoComplete,
  AutoCompleteChangeParams,
  AutoCompleteCompleteMethodParams,
} from "primereact/autocomplete";
import { Page } from "../../../models/common/page";
import { Cliente } from "../../../models/clientes";
import { useState } from "react";
import { useClienteService } from "../../../services/cliente.service";
import { InputDate } from "../../common/input/inputCliente";
import { useVendaService } from "../../../services/venda.service";
import { validationSchema } from "./validationSchema";
import RotaAutenticada from "../../rotaautenticada";

interface RelatorioVendasForm {
  cliente: Cliente;
  dataInicio: string;
  dataFim: string;
}

const RelatorioVendas: React.FC = () => {
  const clienteService = useClienteService();
  const vendasService = useVendaService();

  const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
    content: [],
    first: 0,
    number: 0,
    size: 20,
    totalElements: 0,
  });

  const handleSubmit = (formData: RelatorioVendasForm) => {
    console.log(formData);
    vendasService
      .gerarRelatorioVendas(
        formData.cliente?.id,
        formData.dataInicio,
        formData.dataFim
      )
      .then((blob) => {
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl);
      });
  };

  const formik = useFormik<RelatorioVendasForm>({
    onSubmit: handleSubmit,
    initialValues: {
      cliente: null,
      dataInicio: "",
      dataFim: "",
    },
    validationSchema: validationSchema,
  });

  const handleClienteAutocomplete = (e: AutoCompleteCompleteMethodParams) => {
    const nome = e.query;
    clienteService
      .find(nome, "", 0, 20)
      .then((clientes) => setListaClientes(clientes));
  };

  const handleClienteChange = (e: AutoCompleteChangeParams) => {
    const clienteSelecionado: Cliente = e.value;
    console.log("clienteSelecionado: ", clienteSelecionado);
    formik.setFieldValue("cliente", clienteSelecionado);
  };

  return (
    <RotaAutenticada>
      <Layout titulo="Relatório de Vendas">
        <form onSubmit={formik.handleSubmit}>
          <div className="p-fluid">
            <div className="p-grid">
              <div className="p-col-12">
                <label
                  htmlFor="cliente"
                  className="p-3"
                  style={{ fontSize: "1rem", fontWeight: "700" }}
                >
                  Cliente: *
                </label>
                <AutoComplete
                  id="cliente"
                  name="cliente"
                  value={formik.values.cliente}
                  field="nome"
                  className="p-3"
                  suggestions={listaClientes.content}
                  completeMethod={handleClienteAutocomplete}
                  onChange={handleClienteChange}
                />
                <small className="p-error p-d-block">
                  {formik.errors.cliente}
                </small>
              </div>
              <div className="p-col-6">
                <InputDate
                  id="dataInicio"
                  name="dataInicio"
                  label="Data Início: *"
                  value={formik.values.dataInicio}
                  onChange={formik.handleChange}
                />
                <small className="p-error p-d-block">
                  {formik.errors.dataInicio}
                </small>
              </div>
              <div className="p-col-6">
                <InputDate
                  id="dataFim"
                  name="dataFim"
                  label="Data Fim: *"
                  value={formik.values.dataFim}
                  onChange={formik.handleChange}
                />
                <small className="p-error p-d-block">
                  {formik.errors.dataFim}
                </small>
              </div>
              <div className="p-col p-4">
                <button type="submit" className="button is-link is-fullwidth">
                  Gerar Relatório
                </button>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    </RotaAutenticada>
  );
};

export default RelatorioVendas;
