import { useFormik } from "formik";
import { Cliente } from "../../../models/clientes";
import InputCliente, { InputCPF, InputDate, InputTelefone } from "../../common/input/inputCliente";
import Link from "next/link";
import { validationSchema } from "./validationSchema";
import RotaAutenticada from "../../rotaautenticada";

interface ClienteFromProps {
    cliente: Cliente,
    onSubmit: (Cliente: Cliente) => void;
}

const formScheme: Cliente = {
    id: '',
    nascimento: '',
    nome: '',
    endereco: '',
    cpf: '',
    telefone: '',
    email: '',
    dataCadastro: ''
}


const ClienteForm: React.FC<ClienteFromProps> = ({
    cliente,
    onSubmit
}) => {

    const formik = useFormik<Cliente>({
        initialValues: { ...formScheme, ...cliente},
        onSubmit: onSubmit,
        enableReinitialize: true,
        validationSchema: validationSchema,
    });

    return (
        <RotaAutenticada>
            <form onSubmit={formik.handleSubmit}>

                {formik.values.id &&

                    <div className="columns">

                        <InputCliente id="id"
                            name="id"
                            label="ID: "
                            columnClasses="is-half"
                            className="input"
                            autoComplete="off"
                            disabled
                            value={formik.values.id}
                        />

                        <InputDate id="dataCadastro"
                            name="dataCadastro"
                            label="Data cadastro: "
                            columnClasses="is-half"
                            className="input"
                            disabled
                            value={formik.values.dataCadastro}
                        />

                    </div>

                }

                <div className="columns">

                    <InputCliente id="nome"
                        name="nome"
                        label="Nome: *"
                        columnClasses="is-full"
                        className="input"
                        value={formik.values.nome}
                        error={formik.errors.nome}
                        onChange={formik.handleChange}
                    />

                </div>

                <div className="columns">

                    <InputCPF id="cpf"
                        name="cpf"
                        label="CPF: *"
                        columnClasses="is-half"
                        className="input"
                        value={formik.values.cpf}
                        error={formik.errors.cpf}
                        onChange={formik.handleChange}
                    />

                    <InputDate id="nascimento"
                        name="nascimento"
                        label="Nascimento: *"
                        columnClasses="is-half"
                        className="input"
                        value={formik.values.nascimento}
                        error={formik.errors.nascimento}
                        onChange={formik.handleChange}
                    />

                </div>

                <div className="columns">

                    <InputCliente id="endereco"
                        name="endereco"
                        label="Endereço: *"
                        columnClasses="is-full"
                        className="input"
                        value={formik.values.endereco}
                        error={formik.errors.endereco}
                        onChange={formik.handleChange}
                    />

                </div>    

                <div className="columns">

                    <InputCliente id="email"
                        name="email"
                        label="E-mail: *"
                        columnClasses="is-half"
                        className="input"
                        value={formik.values.email}
                        error={formik.errors.email}
                        onChange={formik.handleChange}
                    />

                    <InputTelefone id="telefone"
                        name="telefone"
                        label="Telefone: *"
                        columnClasses="is-half"
                        className="input"
                        value={formik.values.telefone}
                        error={formik.errors.telefone}
                        onChange={formik.handleChange}
                    />

                </div>

                <div className="field has-addons">
                    
                    <div className="control">
                        <Link href="/components/clientes/listagem">
                            <button className="button is-light is-one-third">Voltar</button>
                        </Link>
                    </div>
                    {!formik.values.id &&
                        <div className="control">
                            <button className="button is-dark is-one-third" onClick={e => formik.resetForm()}>Limpar</button>
                        </div>
                    }
                    <div className="control">
                        <button className="button is-link is-one-third" >{formik.values.id ? "Atualizar" : "Salvar"}</button>
                    </div>

                </div>

            </form>
        </RotaAutenticada>
    );
}

export default ClienteForm;