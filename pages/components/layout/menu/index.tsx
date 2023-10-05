import Link from "next/link";
import { signOut, useSession } from 'next-auth/client'

const Menu: React.FC = () => {

    const [session, loading] = useSession();

    return (
        <aside className="container menu column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile is-dark">
            <p className="menu-label is-hodden-touch subtitle is-6">
                Minhas Vendas
            </p>
            <ul className="menu-list">
                <MenuItem href="/" label="Home"/>
                <MenuItem href="/components/produtos/listagem" label="Produtos"/>
                <MenuItem href="/components/clientes/listagem" label="Clientes"/>
                <MenuItem href="/components/vendas/" label="Venda"/>
                <MenuItem href="/components/relatorios/vendas/" label="Relatórios"/>
                {session &&
                    <MenuItem href="/" onClick={() => signOut()} label="Sair"/>
                }
            </ul>
        </aside>
    )
}

interface MenuItemProps{
    href: string;
    label: string;
    onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
    return (
        <li>
            <Link href={props.href} onClick={props.onClick}>
                <span>{props.label}</span>
            </Link>
        </li>
    )
}

export default Menu;