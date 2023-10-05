import React, { useState } from "react";
import Layout from "../layout";
import { Venda } from "../../models/vendas";
import VendasForm from "./form";
import { useVendaService } from "../../services/venda.service";
import { Alert } from "../common/message";
import RotaAutenticada from "../rotaautenticada";

const Vendas: React.FC = () => {
  const service = useVendaService();
  const [messages, setMessages] = useState<Alert[]>([]);
  const [vendaRealizada, setVendaRealizada] = useState<boolean>(false);

  const irParaOTopo = () => {
    window.scrollTo(0, 0);
  };

  const handleSubmit = (venda: Venda) => {
    console.log("venda: ", venda);
    service
      .realizarVenda(venda)
      .then((response) => {
        setMessages([
          {
            tipo: "is-success",
            texto: "Venda realizada com sucesso!",
          },
        ]);
        setVendaRealizada(true);
        irParaOTopo();
      })
      .catch((error) => {
        console.log("error: ", error);
        setMessages([
          {
            tipo: "is-danger",
            texto:
              "Ocorreu um erro na solicitação, fale com o administrador do sistema!",
          },
        ]);
        irParaOTopo();
      });
  };

  const handleNovaVenda = () => {
    setVendaRealizada(false);
    setMessages([]);
  };

  return (
    <RotaAutenticada>
      <Layout titulo="Venda" mensagens={messages}>
        <VendasForm
          onSubmit={handleSubmit}
          vendaRealizada={vendaRealizada}
          onNovaVenda={handleNovaVenda}
        />
      </Layout>
    </RotaAutenticada>
  );
};

export default Vendas;
