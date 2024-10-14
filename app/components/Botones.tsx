import React, { ReactNode } from "react";

interface BotonAgregarProps {
    children?: ReactNode,
    funcion: (...args: any[]) => void,
    color?: string
}

class Boton extends React.Component<BotonAgregarProps> {
    render() {
        const { children, funcion, color = 'blue' } = this.props;
        return (<button
            className={`inline-flex flex-row bg-${color}-600 border-${color}-700 text-white px-4 py-2 rounded-lg items-center gap-2
            w-full justify-center border border-transparent shadow-sm  hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 sm:w-auto`}
            type="button"
            onClick={funcion}
        >
            {children}
        </button>
        )
    }
}

export { Boton };

