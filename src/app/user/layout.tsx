'use client'

import React, {useEffect} from "react"
import {BottomBar} from "@/components/BottomBar"
import {TransitionRouter} from "next-transition-router"
import {gsap} from "gsap"

export default function UserLayout({
                                       children, // will be a page or nested layout
                                   }: {
    children: React.ReactNode
}) {

    useEffect(() => {
        const updateHeight = () => {
            const screenHeight = window.innerHeight;

            // Find elements by ID
            const header = document.getElementById("header");
            const footer = document.getElementById("footer");

            const headerHeight = header?.offsetHeight || 0;
            const footerHeight = footer?.offsetHeight || 0;

            const contentHeight = screenHeight - headerHeight - footerHeight;

            // Set CSS variable for content height
            document.getElementById('content')?.style.setProperty("min-height", `${contentHeight}px`);
        };

        updateHeight(); // Initial calculation
        window.addEventListener("resize", updateHeight); // Recalculate on resize

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);


    return (
        <div className="flex flex-col min-h-screen">
            <header
                id="header"
                className="mb-3 sticky pt-3 bg-white pb-3 left-0 right-0 flex items-center justify-center z-10">
                <img height={'auto'} width={'40px'} src={'/images/logo-small.png'} alt={'Where is Kevin - logo'}/>
            </header>
            <div id="content"
                 className={'container flex flex-col font-ppmori no-scrollbar overflow-y-auto overflow-x-hidden'}>
                <TransitionRouter
                    auto
                    leave={(next, from, to) => {
                        const tween = gsap.fromTo(
                            'main',
                            {autoAlpha: 1},
                            {autoAlpha: 0, onComplete: next}
                        );
                        return () => tween.kill();
                    }}
                    enter={(next) => {
                        const tween = gsap.fromTo(
                            'main',
                            {autoAlpha: 0},
                            {autoAlpha: 1, onComplete: next}
                        );
                        return () => tween.kill();
                    }}
                >
                        {children}
                </TransitionRouter>
            </div>
            <BottomBar/>

        </div>
    )
}