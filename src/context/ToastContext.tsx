'use client'
// ToastContext.tsx
import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Toast} from 'flowbite-react';
import {HiCheck, HiX} from "react-icons/hi";

interface ToastContextType {
    addToast: (message: string, type: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
    const [toasts, setToasts] = useState<{ id: string; message: string, type: string }[]>([]);

    const addToast = (message: string, type: string) => {
        const id = Math.random().toString(36).substring(2, 15);
        setToasts((prev) => [...prev, {id, message, type}]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000); // Adjust duration as needed
    };

    return (
        <ToastContext.Provider value={{addToast}}>
            {children}
            <div className="fixed bottom-5 container w-full">
                {toasts.map((toast) => (
                    <Toast key={toast.id}  >
                        {toast.type === 'success' &&
                            <div
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5"/>
                            </div>
                        }
                        {toast.type === 'error' &&
                            <div
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                <HiX className="h-5 w-5"/>
                            </div>
                        }

                        <div className="ml-3 text-sm font-normal">{toast.message}</div>
                        <Toast.Toggle onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}/>
                    </Toast>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
