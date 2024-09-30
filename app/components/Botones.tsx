import { IconPlus } from "@tabler/icons-react";
import React, { ReactNode } from "react";

interface BotonAgregarProps {
    children?: ReactNode,
    funcion: () => void
}

class BotonAgregar extends React.Component<BotonAgregarProps> {
    render() {
        const { children, funcion } = this.props;
        return (<button
            className="flex flex-row bg-green-600 border-green-700 text-white px-4 py-2 rounded-lg items-center gap-2"
            type="button"
            onClick={funcion}
        >
            <IconPlus stroke={2} />
            {children}
        </button>
        )
    }
}

export { BotonAgregar };