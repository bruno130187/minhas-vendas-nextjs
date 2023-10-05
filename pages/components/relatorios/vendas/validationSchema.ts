import moment from 'moment';
import * as yup from 'yup';

const msgCampoObrigatorio = "Campo obrigatório!";

export const validationSchema = yup.object().shape({ 
    dataInicio: yup
      .date()
      .transform((value, originalValue) => {
        try {
           let date = originalValue.split('/');
           if (date.length === 3) {
              let newDate = `${date[2]}-${date[1]}-${date[0]}`;
              return new Date(newDate);
           }
           return null;
        } catch (e) {
           return null;
        }
     })
      .required(msgCampoObrigatorio),
    dataFim: yup
      .date()
      .transform((value, originalValue) => {
        try {
           let date = originalValue.split('/');
           if (date.length === 3) {
              let newDate = `${date[2]}-${date[1]}-${date[0]}`;
              return new Date(newDate);
           }
           return null;
        } catch (e) {
           return null;
        }
     }).required(msgCampoObrigatorio)
      .min(
        yup.ref("dataInicio"),
        "A Data Fim deve ser maior que a Data Início"
      )
      .test({
        name: "same",
        exclusive: false,
        params: {},
        message: "A Data Fim deve ser maior que a Data Início",
        test: function(value) {
          const startDate = moment(this.parent.dataInicio).format("dd-MM-yyyy");
          const endDate = moment(value).format("dd-MM-yyyy");
          return !moment(startDate).isSame(moment(endDate));
        },
      }),
});
