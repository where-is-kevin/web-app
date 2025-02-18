'use client'

import styles from './eventCard.module.css'
import {Button} from "flowbite-react";
import React, {useState} from "react";
import {EventInterface} from "@/types/EventInterface";
import {ShareIcon} from "@/components/icons/ShareIcon";
import {HeartIcon} from "@/components/icons/HeartIcon";
import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import {useRouter} from "next/navigation";
import useEventEmitterStore from "@/stores/eventEmitter.store";

export const EventCard = ({event}: { event: EventInterface }) => {
    const router = useRouter()
    const publish = useEventEmitterStore((state) => state.publish);

    const [eventTracked, setEventTracked] = useState(false)

    const trackEvent = () => {
        if (!eventTracked) {
            publish('trackEvent', {event: event});
        }

        axiosInstance.post('/api/v2/user/track/event', {
            uuid: event.uuid,
        }).then(() => {
            setEventTracked(!eventTracked)
        })

    }
    const shareEvent = () => {
        navigator
            .share({
                title: event.title,
                text: event.body,
                url: `${window.location.origin}/event/${event.uuid}`
            })
            .then(() => console.log('Successful share! 🎉'))
            .catch(err => console.error(err));
    }
    return (

        <div
            style={styles}
            className={'bg-primary-1000 overflow-hidden flex-col w-100 rounded-6 flex justify-center items-center  ' + styles.card}
        >
            <div className={'relative w-full aspect-[310/160] bg-[#D5CDFE] flex justify-center items-center'}>
                {event?.type &&
                    <span
                        className={`absolute top-4 left-5 z-10 uppercase text-[10px] font-semibold py-1 px-3 rounded-xl ${event.type === 'event' ? ' text-white bg-primary-1000 ' : 'text-primary bg-white'}`}>
                        {event.type}
                    </span>
                }
                {event?.mainImage ?
                    <Image width={500}
                           height={500}
                           className={'w-full aspect-[3/2] object-cover'}
                           src={event.mainImage}
                           alt={event?.title}/>
                    :
                    <div className={'aspect-[313/187] w-full flex justify-center items-center bg-[#D5CDFE]'}>
                        <Image width={50} height={50} alt={event?.title ?? ''} src={'/images/img-placeholder-x2.png'}
                               className={'object-cover'}/>
                    </div>
                }
            </div>
            <div onClick={() => trackEvent()} className={'absolute right-5 top-4'}>
                <HeartIcon width={'100'} height={'100'} viewBox={'2222'}
                           fill={eventTracked ? 'rgba(92, 60, 250, 1)' : 'rgba(92, 60, 250, .5)'} stroke={''}/>
            </div>
            <div className={'px-6 py-3 overflow-hidden h-full flex flex-col relative pe-16 w-full'}>
                <div onClick={() => shareEvent()} className={'flex flex-col justify-center absolute right-6 top-3'}>
                    <ShareIcon width={'25'} fill={'none'} height={'25'} stroke={'#fff'} viewBox={'0 0 25 25'}/>
                </div>
                <h5 className="text-lg text-white mb-1.5 leading-tight">
                    {event.title}
                </h5>
                {event.match ?
                    <span className={'leading-3 text-lime-1000 text-xl mb-2 font-semibold'}>{event.match} Match</span>
                    :
                    <span
                        className={'leading-3 text-lime-1000 text-xl mb-2 font-semibold'}>Calculating Match Score</span>
                }

                <span className={'text-white text-sm font-semibold leading-tight mb-1.5'}>{event.address}</span>

                {event.price &&
                    <span className={'text-white mb-1.5 leading-5 text-xs'}>{event.price}</span>
                }

                {event.hostedBy &&
                    <div className={'flex flex-col'}>
                        <span
                            className={'text-white text-[10px] font-semibold text-almost-black mb-1.5'}>HOSTED BY</span>
                        <span className={'text-white text-xs font-semibold'}>{event.hostedBy}</span>
                    </div>
                }
                {event.body &&
                    <div className="mb-3" style={{marginRight: '-45px'}}>
                        <span className="text-xs text-white">ABOUT</span>
                        <p className="text-xs overflow-y-auto text-white" style={{maxHeight: '130px'}}>
                            {event.body}
                        </p>
                    </div>
                }


            </div>
            <div className={'flex justify-center items-center mt-auto pb-8'}>
                <Button
                    type={'button'}
                    size={'lg'}
                    onClick={() => router.push(`/event/${event.uuid}`)}
                    className={'h-10 bg-primary-900 text-[#F5F5F5] enabled:hover:bg-primary-1000 mt-auto min-h-10 px-3'}
                    label={'Sign in'}>
                    See more
                </Button>
            </div>
        </div>
    )
}