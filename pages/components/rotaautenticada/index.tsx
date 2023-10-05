import React from "react";
import { signIn, useSession } from "next-auth/client";
import Loader from "../common/loader";

interface rotaAutenticadaProps {
    children: React.ReactNode;
}

const RotaAutenticada: React.FC<rotaAutenticadaProps> = ({
    children
}) => {

    const [session, loading] = useSession();

    console.log("session: ", session);

    if(loading){
        return (
            <Loader show />
        )
    }

    if (!session) {
        signIn();
        return null;
    }

    return (
        <div>
            {children}
        </div>
    );
}

export default RotaAutenticada;