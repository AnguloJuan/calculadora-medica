'use client';

import {
    IconAlertTriangle,
    IconBell,
    IconCircleCheck,
    IconHexagonLetterX,
    IconX,
} from '@tabler/icons-react';
import { useEffect } from 'react';
import { create } from 'zustand';
import { Each } from './EachOf';
import { devtools } from 'zustand/middleware'
import type { } from 'redux-devtools' // required for devtools typing

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'warning' | 'error' | 'default';
}

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'default') => void;
    removeToast: (id: number) => void;
}


export default function Toast() {

    const styleType = {
        success: {
            bg: 'bg-green-100',
            iconStyle: 'bg-green-300 text-green-700',
            lineColor: 'bg-green-500',
            icon: <IconCircleCheck />,
        },
        warning: {
            bg: 'bg-yellow-100',
            iconStyle: 'bg-yellow-300 text-yellow-700',
            lineColor: 'bg-yellow-500',
            icon: <IconAlertTriangle />,
        },
        error: {
            bg: 'bg-red-100',
            iconStyle: 'bg-red-300 text-red-700',
            lineColor: 'bg-red-500',
            icon: <IconHexagonLetterX />,
        },
        default: {
            bg: 'bg-zinc-100',
            iconStyle: 'bg-zinc-300 text-zinc-700',
            lineColor: 'bg-zinc-500',
            icon: <IconBell />,
        },
    };

    const { toasts, removeToast } = useToast();

    useEffect(() => {
        toasts.forEach((toast) => {
            const timer = setTimeout(() => removeToast(toast.id), 5000);
            return () => clearTimeout(timer);
        });
    }, [toasts, removeToast]);

    return (
        <div className="fixed bottom-3 right-2 flex flex-col-reverse gap-2 w-full max-w-sm z-[99999]">
            {
                <Each
                    of={toasts}
                    render={(toast) => (
                        <div
                            key={toast.id}
                            className={`relative p-3 text-gray-500 ${styleType[toast.type].bg
                                } rounded-lg shadow overflow-hidden`}
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${styleType[toast.type].iconStyle
                                        } rounded-lg `}
                                >
                                    {styleType[toast.type].icon}
                                </div>
                                <p className="text-sm font-normal">{toast.message}</p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="ms-auto -mx-1.5 -my-1.5 text-black hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
                                >
                                    <IconX />
                                </button>
                                <div
                                    className={`absolute bottom-0 right-0 ${styleType[toast.type].lineColor} h-1 animate-line-load`}
                                />
                            </div>
                        </div>
                    )}
                />
            }
        </div>
    );
}

export const useToast = create<ToastStore>()(
    devtools(
        (set) => ({
            toasts: [],
            addToast: (message, type = 'default') =>
                set((state) => ({
                    toasts: [...state.toasts, { id: Math.random(), message, type }],
                })),
            removeToast: (id) =>
                set((state) => ({
                    toasts: state.toasts.filter((toast) => toast.id !== id),
                })),
        }),
        { name: 'toasts' }
    ),
)