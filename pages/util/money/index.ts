
export const converterEmBigdecimal = (value: any): String => {

    if (!value) {
        return '0,00';
    };

    let arrayValue = value.split(",");
    let centavos = 0;
    let retorno = '';

    if (arrayValue[1]) {
        if (arrayValue[1] > 0) {
            centavos = arrayValue[1];
            retorno = arrayValue[0].replace(".", "") + "." + centavos
        } else {
            retorno = value.replace(".", "").replace(",", ".");
        };
    };

    return retorno;
};

export const formatReal = ( valor: any ) => {
    let arrayValue = valor.split(".");

    let v = ((valor.replace(/\D/g, '') / 100).toFixed(2) + '').split('.');

    const m = v[0].split('').reverse().join('').match(/.{1,3}/g);

    for (let i = 0; i < m.length; i++)
        m[i] = m[i].split('').reverse().join('') + '.';

    const r = m.reverse().join('');

    return r.substring(0, r.lastIndexOf('.')) + ',' + v[1];
};

export const formataRealInicial = (valor: any) => {
    let retorno = new Intl.NumberFormat("pt-BR", {
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
      }).format(valor);

    return retorno;
};
