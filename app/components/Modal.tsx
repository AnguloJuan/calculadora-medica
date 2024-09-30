'use client'
import { ButtonHTMLAttributes, FunctionComponent } from "react";
import { useState } from 'react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

interface botonAccion {
    contenido: React.ReactNode;
    funcion: () => void;
    cerrarModal: boolean;
    className?: string;
}

interface ModalProps {
    titulo?: string | React.ReactNode;
    children: string | React.ReactNode;
    botonesAccion?: botonAccion[];
    abierto: boolean;
    setAbierto: () => void;
}

const Modal: FunctionComponent<ModalProps> = (ModalProps) => {
    const { titulo, children, botonesAccion, abierto, setAbierto } = ModalProps;

    return (
        <Dialog open={abierto} onClose={setAbierto} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95
                        min-h-screen w-full md:max-w-screen-md lg:max-w-screen-lg py-12"
                    >
                        <DialogTitle className="text-lg font-semibold text-center">{titulo}</DialogTitle>

                        {children}

                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            {botonesAccion?.map((boton, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        boton.funcion();
                                        if (boton.cerrarModal) setAbierto();
                                    }}
                                    className={boton.className ? boton.className :
                                        `w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
                                >
                                    {boton.contenido}
                                </button>
                            ))}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

export default Modal;