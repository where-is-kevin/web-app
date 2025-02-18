'use client'

import {Suspense, useEffect, useRef, useState} from "react";
import Swipeable from "@/components/event/Swipeable";
import axiosInstance from "@/utils/axiosInstance";
import useEventStore from "@/stores/event.store";
import {SwipeRight} from "@/components/animations/SwipeRight";
import {SwipeHints} from "@/components/animations/SwipeHints";

export function QuestionnaireStepThree() {

    const { events, setEvents, showHints, setShowHints } = useEventStore(state => state)

    useEffect(() => {
        window.addEventListener('animation-swipe-left-finished', function(){
            setShowHints(false)
        })
    }, []);

    useEffect(() => {
        if (events.length > 0) {
            return
        }
        axiosInstance.get('/api/v2/event/read').then((res) => {
            setEvents(res.data.rows)
        })
    }, [events, setEvents]);

    return (
        <>
            {showHints &&
                <SwipeHints />
            }

            {events.length > 0 &&
                <div className={'relative swipe-card-wrapper'}>
                    <Swipeable events={events}/>
                </div>
            }
        </>
    );
}