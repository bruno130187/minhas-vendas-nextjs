import { InputHTMLAttributes, ChangeEvent } from 'react';

interface InputProdutoProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    label: string;
    columnClasses?: string;
    error?: string;
}

const InputProduto: React.FC<InputProdutoProps> = ({
    id,
    onChange,
    label,
    columnClasses,
    error,
    ...inputProdutoProps
}: InputProdutoProps) => {
    //console.log("Bruno inputProps: ", inputProps);
    //console.log("Bruno onChange: ", onChange);

    return (
        <div className={`field column ${columnClasses}`}>
            <label className="label" htmlFor={id}>{label}</label>
            <div className="control">
                <input className="input"
                    id={id}
                    {...inputProdutoProps}
                    onChange={onChange}
                />
                {error &&
                    <p className="help is-danger">{error}</p>
                }
            </div>
        </div>
    )
}

export default InputProduto;