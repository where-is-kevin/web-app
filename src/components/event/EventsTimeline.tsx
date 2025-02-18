"use client"

import {useEffect} from "react"
import {EventInterface} from "@/types/EventInterface"
import useEventTimelineStore from "@/stores/eventTimeline.store"
import dayjs from "dayjs"
import {Spinner} from "flowbite-react"
import {useTransitionRouter} from "next-transition-router"
import {LocationIcon} from "@/components/icons/LocationIcon";

export function EventsTimeline() {

    const {events, loading, fetchEvents, selectedDate} = useEventTimelineStore(state => state)

    const router = useTransitionRouter()
    useEffect(() => {
        fetchEvents(selectedDate ?? new Date())
    }, [selectedDate]);

    if (loading) {
        return <div className={'container relative h-full flex justify-center items-center'}>
            <Spinner className={'fill-primary-1000'} size={'xl'}/>
        </div>;
    }

    return (
        <>
            {events.length === 0
                ? <div className={'flex justify-center items-center mt-10 font-ppmori text-sm font-semibold'}>
                    No signed up events for {dayjs(selectedDate).format('D/M/YYYY')}
                </div>
                : <div className={'timeline-separator'}></div>

            }

            {events.map((event: EventInterface, index) =>
                <>
                    <div onClick={() => router.push(`/event/${event.uuid}`)} className={'flex gap-8 mb-4 font-ppmori'}>
                        <div className={'flex flex-col flex-[1]'}>
                            <span className={'font-semibold text-md text-[#131313] mb-1.5'}>
                                {dayjs(event.startTime).format('HH:mm')}
                            </span>
                            {event.endTime &&
                                <span className={'text-sm font-semibold text-[#D6D6D9]'}>
                                    {dayjs(event.endTime).format('HH:mm')}
                                </span>
                            }

                        </div>
                        <div className={'flex-[5] w-full flex flex-col p-4 bg-[#F2F2F3] rounded-2xl text-[#131314] '}>
                            <h2 className={'font-semibold text-md pb-2 leading-tight'}>
                                {event.title}
                            </h2>
                            <span className={'font-semibold text-xs pb-4'}>
                                {event.address}
                            </span>
                            {event.location &&
                                <div className={'text-xs pb-2 flex items-center gap-1'}>
                                    <LocationIcon width={'22'} height={'22'} viewBox={'22'} fill={'#6F6F76'}
                                                  stroke={'1'}/> {event.location}
                                </div>
                            }

                            {event.hostedBy &&
                                <span className={'text-xs'}>
                                    {event.hostedBy}
                                </span>
                            }

                        </div>
                    </div>
                </>)
            }
        </>
    );
}