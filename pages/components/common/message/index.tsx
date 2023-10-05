interface MessageProps {
    tipo: string;
    field?: string;
    texto: string;
}

export interface Alert {
    tipo: string;
    field?: string;
    texto: string;
}

export const Message: React.FC<MessageProps> = ({
    tipo,
    field,
    texto
}) => {
    return (
        <article className={`message ${tipo}`}>
            <div className="message-body">
                {field && `${field}: `}{texto}
            </div>
        </article>
    )
}