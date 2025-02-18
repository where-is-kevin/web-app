import {Swiper, SwiperSlide} from "swiper/react";
// Import Swiper styles
import 'swiper/css';
import React, {useEffect, useRef, useState} from "react";
import {EventCardSlider} from "@/components/event/EventCardSlider";
import {EventInterface} from "@/types/EventInterface";
import {eventService} from "@/lib/service/EventService";
import {Spinner} from "flowbite-react";

export const LikedEventsCarousel = () => {

    const [isLoading, setLoading] = useState(true)
    const [events, setEvents] = useState<EventInterface[] | null>(null)

    useEffect(() => {

        try {
            eventService.getLikedEvents().then(res => {
                setEvents(res)
                setLoading(false)
            })

        } catch (e) {
            console.log(e)
            setLoading(false)
        }


    }, [])

    return (
        <>


            {isLoading ? <div className={'flex justify-center items-center'}><Spinner className={'fill-primary-1000'} size={'xl'}/></div> :
                <>
                    {events?.length ?
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={1.5}
                            loop={false}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            {events?.map((event) => (
                                <SwiperSlide key={event.uuid}>
                                    <EventCardSlider event={event}/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        :
                        <div className={'text-[#131313] font-ppmori text-sm font-semibold'}>
                            No liked events
                        </div>
                    }


                </>

            }

        </>
    )
        ;
};