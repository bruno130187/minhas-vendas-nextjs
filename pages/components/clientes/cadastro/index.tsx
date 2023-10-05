import { useState, useEffect } from "react";
import Layout from "../../layout";
import ClienteForm from "./form";
import { Cliente } from "../../../models/clientes";
import { useClienteService } from "../../../services/cliente.service";
import { Alert } from "../../common/message";
import { useRouter } from "next/router";
import RotaAutenticada from "../../rotaautenticada";

const CadastroCliente: React.FC = () => {
  const service = useClienteService();
  const router = useRouter();
  const { id } = router.query;

  const [cliente, setCliente] = useState<Cliente>({});
  const [messages, setMessages] = useState<Array<Alert>>([]);

  useEffect(() => {
    if (id) {
      service.carregaClientePorId(id).then((clienteEncontrado) => {
        setCliente(clienteEncontrado);
      });
    }
  }, []);

  const handleSubmit = (cliente: Cliente) => {
    if (cliente.id) {
      service.atualizar(cliente).then((response) => {
        setMessages([
          {
            tipo: "is-success",
            texto: "Cliente atualizado com sucesso!",
          },
        ]);
      });
    } else {
      service.salvar(cliente).then((clienteSalvo) => {
        setCliente(clienteSalvo);
        setMessages([
          {
            tipo: "is-success",
            texto: "Cliente criado com sucesso!",
          },
        ]);
      });
    }
  };

  return (
    <RotaAutenticada>
      <Layout titulo="Clientes" mensagens={messages}>
        <ClienteForm cliente={cliente} onSubmit={handleSubmit} />
      </Layout>
    </RotaAutenticada>
  );
};

export default CadastroCliente;
