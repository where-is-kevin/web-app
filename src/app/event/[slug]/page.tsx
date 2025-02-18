'use client'

import React, {useEffect, useState} from 'react';
import {EventDetails} from "@/components/event/EventDetails";
import {EventHeader} from "@/components/event/EventHeader";
import axiosInstance from "@/utils/axiosInstance";
import {EventInterface} from "@/types/EventInterface";
import Image from "next/image";
import useEventStore from "@/stores/event.store";
import {HeartIcon} from "@/components/icons/HeartIcon";
import dayjs from "dayjs";
import useEventEmitterStore from "@/stores/eventEmitter.store";
import {CollectionDrawer} from "@/components/event/CollectionDrawer";

const Page = ({params}: { params: { slug: string } }) => {

    const [event, setEvent] = useState<EventInterface | null>()
    const {events} = useEventStore(state => state)
    const [eventTracked, setEventTracked] = useState(false)

    const [hideButtons, setHideButtons] = useState(true)
    const publish = useEventEmitterStore((state) => state.publish);

    const trackEvent = () => {
        if (!eventTracked) {
            publish('trackEvent', { event: event });
        }

        axiosInstance.post('/api/v2/user/track/event', {
            uuid: event?.uuid,
        }).then(() => {
            setEventTracked(!eventTracked)
        })
    }

    useEffect(() => {

        const event = events.find((event: EventInterface) => event.uuid === params.slug)
        setEvent(event)

        if (event) {
            setHideButtons(false)
            return
        }

        axiosInstance.get(`/api/v2/event/read/?id=${params.slug}`).then(res => {
            setEvent(res.data.rows[0])
        })
    }, [params, events]);

    const tags = [
        {text: 'RESTAURANT', bgColor: 'bg-fuchsia-400'},
        {text: 'CONCERT', bgColor: 'bg-violet-800'},
        {text: 'CONFERENCE', bgColor: 'bg-orange-600'},
        {text: 'HIDDEN GEM', bgColor: 'bg-indigo-600'}
    ];

    return (
        <main className="flex flex-col bg-white">
            <EventHeader
                title={event?.title ?? ''}
                date={`${dayjs(event?.startTime).format('MMM DD')} - ${dayjs(event?.endTime).format('MMM DD')}`}
            />
            <section
                className="relative overflow-hidden flex flex-col justify-center py-px mt-3 w-full rounded-tr-[24px] rounded-tl-[24px]">
                {event?.type &&
                    <span
                        className={`absolute top-4 left-5 z-10 uppercase text-[10px] font-semibold py-1 px-3 rounded-xl ${event.type === 'event' ? ' text-white bg-primary-1000 ' : 'text-primary bg-white'}`}>
                        {event.type}
                    </span>
                }

                <div onClick={() => trackEvent()} className={'absolute right-5 top-3.5'}>
                    <HeartIcon width={'100'} height={'100'} viewBox={'2222'}
                               fill={eventTracked ? 'rgba(92, 60, 250, 1)' : 'rgba(92, 60, 250, .5)'} stroke={''}/>
                </div>

                {event?.mainImage
                    ?
                    <Image width={600} height={600} alt={event?.title ?? ''} src={event.mainImage}
                           className={'aspect-[3/2] object-cover'}/>
                    :
                    <div className={'aspect-[3/2] w-full flex justify-center items-center bg-[#D5CDFE]'}>
                        <Image width={50} height={50} alt={event?.title ?? ''} src={'/images/img-placeholder-x2.png'}
                               className={'object-cover'}/>
                    </div>
            
                }

            </section>
            <EventDetails event={event} tags={tags} hideButtons={hideButtons}/>

            <CollectionDrawer />
        </main>

    );

};

export default Page