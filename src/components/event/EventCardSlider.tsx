import {EventInterface} from "@/types/EventInterface";
import Image from "next/image";
import React from "react";
import {useTransitionRouter} from "next-transition-router";

interface EventCardSliderProps {
    event: EventInterface
}

export const EventCardSlider = ({event}: EventCardSliderProps) => {

    const router = useTransitionRouter()

    return (
        <>
            <article onClick={() => router.push(`/event/${event.uuid}`)} className="flex overflow-hidden flex-col rounded-2xl bg-[#D5CDFE]">
                <header className="flex w-full aspect-[3/2] justify-center items-center">
                    {event?.mainImage ?
                        <Image width={400} height={400} className={'w-full aspect-[3/2] object-cover'} src={event.mainImage}
                               alt={event?.title}/>
                        :
                        <div className={'w-full aspect-[3/2] flex justify-center items-center bg-[#D5CDFE]'}>
                            <Image width={50} height={50} alt={event?.title ?? ''} src={'/images/img-placeholder-x2.png'}
                                   className={'object-cover'}/>
                        </div>
                    }
                    {/*<Tag text={tagText}/>*/}
                </header>
                <div className={'p-4'}>
                    <div className={'text-sm text-[#131313]'}>
                        {event.title}
                    </div>
                    <div className={'mt-1 text-md font-semibold text-[#131313]'}>
                        {event.location}
                    </div>
                </div>
                {/*<Content eventName={eventName} eventLocation={eventLocation}/>*/}
            </article>
        </>
    );
};