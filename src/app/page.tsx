'use client'

import {Button} from "flowbite-react";
import Login from "@/components/form/Login";
import {useRouter} from "next/navigation"
import {Logo} from "@/components/Logo";
import React, {useEffect} from "react";
import useEventStore from "@/stores/event.store";
import useQuestionnaireStore from "@/stores/questionnaire.store";

export default function Home() {

    const eventStore = useEventStore()
    const questionnaireStore = useQuestionnaireStore()



    useEffect(() => {
        eventStore.reset()
        questionnaireStore.reset()
        // if ("serviceWorker" in navigator) {
        //     navigator.serviceWorker
        //         .register("/sw.js")
        //         .then((registration) => {
        //             // console.log("Registration successful");
        //         })
        //         .catch((error) => {
        //             // console.log("Service worker registration failed");
        //         });
        // }

    }, []);
    const router = useRouter()

    return <>
        <div className={'container flex flex-col h-svh font-ppmori'}>
            <div className="col-12 logo h-full bg-white flex m-auto items-center justify-center flex-col">
                <Logo/>
                <div className={'text-[#757575] text-center mt-6 text-md mb-10'}>
                    Your travel copilot
                </div>
            </div>
            {/*<SwipeLeft />*/}

            <div className={'hidden'}>
                <Login/>
            </div>

            <div className="w-full">
                <Button label={'Get started'} size={'lg'} onClick={() => router.push('/login')}
                        className={'h-10 bg-primary-1000 text-[#F5F5F5] w-full enabled:hover:bg-primary-1000 mt-auto mb-10 min-h-10'}>
                </Button>
            </div>
        </div>

    </>
}
