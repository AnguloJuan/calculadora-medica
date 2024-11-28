'use client';

import {
  IconAlertTriangle,
  IconBell,
  IconCircleCheck,
  IconHexagonLetterX,
  IconX,
} from '@tabler/icons-react';
import { useEffect } from 'react';
import type { } from 'redux-devtools'; // required for devtools typing
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Each } from '@/components/EachOf';

interface Toast {
  id: number;
  message: string | JSX.Element;
  type: 'success' | 'warning' | 'error' | 'default';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string | JSX.Element, type?: 'success' | 'warning' | 'error' | 'default') => void;
  removeToast: (id: number) => void;
}


export default function Toast() {

  const styleType = {
    success: {
      bg: 'bg-success-container',
      iconStyle: 'bg-success text-success-foreground',
      lineColor: 'bg-green-500',
      icon: <IconCircleCheck />,
    },
    warning: {
      bg: 'bg-warning-container',
      iconStyle: 'bg-warning text-warning-foreground',
      lineColor: 'bg-yellow-500',
      icon: <IconAlertTriangle />,
    },
    error: {
      bg: 'bg-destructive-container',
      iconStyle: 'bg-destructive text-destructive-foreground',
      lineColor: 'bg-red-500',
      icon: <IconHexagonLetterX />,
    },
    default: {
      bg: 'bg-container',
      iconStyle: 'bg-muted text-muted-foreground',
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
    <div className="fixed bottom-3 right-2 flex flex-col-reverse gap-4 w-full max-w-sm z-[99999]">
      {
        <Each
          of={toasts}
          render={(toast) => (
            <div
              key={toast.id}
              className={`relative p-3 text-muted-foreground ${styleType[toast.type].bg
                } rounded-lg shadow-lg drop-shadow-lg overflow-hidden`}
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
                  className="ms-auto -mx-1.5 -my-1.5 hover:text-opacity-90 rounded-lg focus:ring-2 focus:ring-accent p-1.5 hover:bg-accent inline-flex items-center justify-center h-8 w-8"
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