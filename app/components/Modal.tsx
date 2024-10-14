'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FunctionComponent, ReactNode } from "react";

interface ModalProps {
    titulo?: string | React.ReactNode;
    children: string | React.ReactNode;
    botonesAccion?: ReactNode;
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
                        w-full md:max-w-screen-md lg:max-w-screen-lg py-12"
                    >
                        <DialogTitle className="text-lg font-semibold text-center">{titulo}</DialogTitle>

                        {children}

                        <div className="px-4 py-3 sm:flex sm:flex-row sm:px-6 items-center justify-center">
                            {/*validate if botonAccion is type BotonAccion | ReactNode*/}
                            {botonesAccion}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

export default Modal;