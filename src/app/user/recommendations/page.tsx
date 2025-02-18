'use client'

import Recommendations from "@/components/event/Recommendations";
import axiosInstance from "@/utils/axiosInstance";
import useEventStore from "@/stores/event.store";
import {useEffect} from "react";
import {Spinner} from "flowbite-react";

export default function Page() {

    const {events, loading, fetchEvents} = useEventStore();

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    if (loading) {
        return <div className={'container relative mt-10 min-h-[33rem] flex justify-center items-center'}>
            <Spinner className={'fill-primary-1000'} size={'xl'}/>
        </div>;
    }

    return <>
        <main>
            <div className={'relative swipe-card-wrapper'}>
                <Recommendations/>
            </div>
        </main>
    </>
}