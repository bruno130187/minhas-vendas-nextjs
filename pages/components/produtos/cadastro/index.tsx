import { useState, ChangeEvent, useEffect } from "react";
import Layout from "../../layout";
import Input from "../../common/input/inputProduto";
import { Produto } from "../../../models/produtos";
import { useProdutoService } from "../../../services/produto.service";
import {
  formatReal,
  formataRealInicial,
  converterEmBigdecimal,
} from "../../../util/money";
import { Alert } from "../../common/message";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/router";
import RotaAutenticada from "../../rotaautenticada";

const msgCampoObrigatorio = "Campo obrigatório!";

const validationSchema = yup.object().shape({
  sku: yup
    .string()
    .trim()
    .required(msgCampoObrigatorio)
    .min(5, "Deve ter pelo menos 5 caracteres!"),
  preco: yup
    .number()
    .required(msgCampoObrigatorio)
    .moreThan(0, "O preço deve ser maior do que 0!"),
  nome: yup
    .string()
    .trim()
    .required(msgCampoObrigatorio)
    .min(5, "Deve ter pelo menos 5 caracteres!"),
  descricao: yup
    .string()
    .trim()
    .required(msgCampoObrigatorio)
    .min(20, "Deve ter pelo menos 20 caracteres!"),
});

interface FormErrors {
  sku?: string;
  preco?: string;
  nome?: string;
  descricao?: string;
}

const CadastroProduto = () => {
  const [id, setId] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [dataCadastro, setDataCadastro] = useState<string>("");
  const [messages, setMessages] = useState<Array<Alert>>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();
  const { id: paramId } = router.query;

  const service = useProdutoService();

  useEffect(() => {
    if (paramId) {
      service.carregaProdutoPorId(paramId).then((produtoEncontrado) => {
        setId(produtoEncontrado.id);
        setSku(produtoEncontrado.sku);
        setPreco(formataRealInicial(`${produtoEncontrado.preco}`));
        setNome(produtoEncontrado.nome);
        setDescricao(produtoEncontrado.descricao);
        setDataCadastro(produtoEncontrado.dataCadastro);
      });
    }
  }, [paramId, service]);

  const reset = () => {
    setId("");
    setSku("");
    setPreco("");
    setNome("");
    setDescricao("");
    setDataCadastro("");
  };

  const submit = () => {
    const produto: Produto = {
      id,
      sku,
      preco: converterEmBigdecimal(preco),
      nome,
      descricao,
    };

    validationSchema
      .validate(produto)
      .then((obj) => {
        setErrors({});

        if (id) {
          service.atualizar(produto).then((respose) => {
            setMessages([
              {
                tipo: "is-success",
                texto: "Produto atualizado com sucesso!",
              },
            ]);
          });
        } else {
          service.salvar(produto).then((produtoResponse) => {
            setId(produtoResponse.id);
            setDataCadastro(produtoResponse.dataCadastro);
            setMessages([
              {
                tipo: "is-success",
                texto: "Produto cadastrado com sucesso!",
              },
            ]);
          });
        }
      })
      .catch((err) => {
        console.log(JSON.parse(JSON.stringify(err)));
        let field = err.path;
        let message = err.message;

        setErrors({
          [field]: message,
        });
      });
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    switch (e.target.id) {
      case "inputSku":
        setSku(e.target.value);
        break;
      case "inputPreco":
        if (e.target.value && !Number.isNaN(e.target.value)) {
          setPreco(formatReal(e.target.value));
        }
        break;
      case "inputNome":
        setNome(e.target.value);
        break;
      case "inputDesc":
        setDescricao(e.target.value);
        break;
      case "inputDataCadastro":
        setDataCadastro(e.target.value);
        break;
      default:
        console.log(`Sorry, we are out of ${e.target.id}.`);
    }
  };

  return (
    <RotaAutenticada>
      <Layout titulo="Produtos" mensagens={messages}>
        {id && (
          <div className="columns">
            <Input
              id="inputId"
              label="ID: "
              columnClasses="is-half"
              className="input"
              value={id}
              disabled={true}
            />

            <Input
              id="inputDataCadastro"
              label="Data Cadastro: "
              columnClasses="is-half"
              className="input"
              value={dataCadastro}
              disabled={true}
            />
          </div>
        )}

        <div className="columns">
          <Input
            id="inputSku"
            label="SKU: *"
            columnClasses="is-half"
            className="input"
            placeholder="Digite o SKU do produto"
            error={errors.sku}
            onChange={onChangeHandler}
            value={sku}
          />

          <Input
            id="inputPreco"
            label="Preço: *"
            columnClasses="is-half"
            className="input"
            placeholder="Digite o Preço do produto"
            maxLength={16}
            error={errors.preco}
            onChange={onChangeHandler}
            value={preco}
          />
        </div>

        <div className="columns">
          <Input
            id="inputNome"
            label="Nome: *"
            columnClasses="is-full"
            className="input"
            placeholder="Digite o Nome do produto"
            error={errors.nome}
            onChange={onChangeHandler}
            value={nome}
          />
        </div>

        <div className="columns">
          <div className="field column is-full">
            <label className="label" htmlFor="inputDesc">
              Descrição: *
            </label>
            <div className="control">
              <textarea
                className="textarea"
                id="inputDesc"
                onChange={(e) => setDescricao(e.target.value)}
                value={descricao}
                placeholder="Digite a descrição detalhada do produto"
              />
              {errors.descricao && (
                <p className="help is-danger">{errors.descricao}</p>
              )}
            </div>
          </div>
        </div>

        <div className="field has-addons">
          <div className="control">
            <Link href="/components/produtos/listagem">
              <button className="button is-light">Voltar</button>
            </Link>
          </div>
          {!id && (
            <div className="control">
              <button
                className="button is-dark is-one-third"
                onClick={(e) => reset()}
              >
                Limpar
              </button>
            </div>
          )}
          <div className="control ">
            <button className="button is-link is-fullwidth" onClick={submit}>
              {id ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>
      </Layout>
    </RotaAutenticada>
  );
};

export default CadastroProduto;
