import * as yup from 'yup';

const msgCampoObrigatorio = "Campo obrigatório!";
const campoObrigatorioValidation = yup.string().trim().required(msgCampoObrigatorio);

export const validationSchema = yup.object().shape({
    nome: campoObrigatorioValidation
                    .min(2, "Deve ter pelo menos 2 caracteres!"),
    cpf: campoObrigatorioValidation
                    .min(14, "Deve ter pelo menos 14 caracteres!"),
    nascimento: campoObrigatorioValidation
                    .min(10, "Deve ter pelo menos 10 caracteres!"),
    endereco: campoObrigatorioValidation
                    .min(20, "Deve ter pelo menos 20 caracteres!"),
    email: campoObrigatorioValidation
                    .min(2, "Deve ter pelo menos 2 caracteres!")
                    .email("Não é um e-mail válido!"), 
    telefone: campoObrigatorioValidation
                    .min(13, "Deve ter pelo menos 13 caracteres!"),             
});
