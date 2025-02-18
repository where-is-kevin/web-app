import type {Metadata} from "next";
import "./globals.css";
import {CustomFlowbiteTheme, Flowbite} from "flowbite-react";
import theme from './../theme/where-is-kevin-theme.json'
import {ToastProvider} from "@/context/ToastContext";

export const metadata: Metadata = {
    title: "Where is Kevin",
    description: "Your AI Travel Companion",
    manifest: '/manifest.json'
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    const whereIsKevinTheme: CustomFlowbiteTheme = theme

    return (
        <html lang="en">
        <body>
        <Flowbite theme={{theme: whereIsKevinTheme}}>
            <ToastProvider>
                {children}
            </ToastProvider>
        </Flowbite>
        </body>
        </html>
    );
}
