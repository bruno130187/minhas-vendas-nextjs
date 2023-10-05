import * as yup from 'yup';

const msgCampoObrigatorio = "Campo obrigatório!";
const campoObrigatorioValidation = yup.string().trim().required(msgCampoObrigatorio);

export const validationSchema = yup.object().shape({
    cliente: yup.object().nullable(true).required(msgCampoObrigatorio),
    itens: yup.array().min(1, "Deve conter pelo menos um produto!"),
    formaPagamento: campoObrigatorioValidation,         
});
