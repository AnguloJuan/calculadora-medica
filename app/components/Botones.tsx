import React, { ReactNode } from "react";

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode,
    variante?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
    estilo?: string
}

const Boton: React.FC<BotonProps> = ({ variante, children, estilo, ...props }) => {
    const styleType = {
        primary: 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 border-gray-700 text-white hover:bg-gray-700 focus:ring-gray-500',
        success: 'bg-green-600 border-green-700 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 border-red-700 text-white hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-600 border-yellow-700 text-white hover:bg-yellow-700 focus:ring-yellow-500',
        info: 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700 focus:ring-blue-500',
        light: 'bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
        dark: 'bg-gray-800 border-gray-900 text-white hover:bg-gray-900 focus:ring-gray-500',
        default: 'bg-gray-400 border-gray-500 text-white hover:bg-gray-500 focus:ring-gray-500',
    }
    return (<button
        {...props}
        className={`inline-flex flex-row text-white px-4 py-2 rounded-lg items-center gap-2 w-full justify-center border border-transparent shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto ${styleType[variante || 'default']} ${estilo}`}
    >
        {children}
    </button>
    )
}

export { Boton };