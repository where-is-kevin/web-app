import {Swiper, SwiperSlide} from "swiper/react";
// Import Swiper styles
import 'swiper/css';
import React, {useEffect, useState} from "react";
import {EventCardSlider} from "@/components/event/EventCardSlider";
import {EventInterface} from "@/types/EventInterface";
import {eventService} from "@/lib/service/EventService";
import {Dropdown, Spinner} from "flowbite-react";
import {CollectionInterface} from "@/types/CollectionInterface";

export const TrackedEventsCarousel = () => {

    const [isLoading, setLoading] = useState(true)
    const [collections, setEvents] = useState<EventInterface[] | null>(null)

    const [selectedCollection, setSelectedCollection] = useState<CollectionInterface|null>(null)
    useEffect(() => {

        try {
            eventService.getTrackedEvents().then(res => {
                setEvents(res)
                setLoading(false)

                setSelectedCollection(res[0])
            })
        } catch (e) {
            console.log(e)
            setLoading(false)
        }


    }, [])

    return (
        <>

           <div className="w-full collections-dropdown-wrapper mb-3">
               <span className="font-semibold text-xs">Collection:</span>
               <Dropdown data-testid="collections-dropdown" inline theme={{
                   inlineWrapper: 'bg-transparent text-primary-1000',
                   content: 'bg-transparent text-white mb-3',
                   floating: {base: 'bg-transparent text-white mb-3'}
               }}
                         placement="right" label={selectedCollection?.title ?? 'Private'}>
                   <Dropdown.Header>
                       <span className="block text-xs font-semibold text-primary-1000">Collections</span>
                   </Dropdown.Header>
                   {collections?.length && collections.map((collection: any) => (
                       <Dropdown.Item className="text-xs"
                                      key={collection.uuid}
                                      onClick={() => setSelectedCollection(collection)}>{collection?.title}</Dropdown.Item>
                   ))}

               </Dropdown>
           </div>

            {isLoading ? <div className={'flex justify-center items-center'}><Spinner className={'fill-primary-1000'}
                                                                                      size={'xl'}/></div> :
                <>
                    {selectedCollection?.events?.length ?
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={1.5}
                            loop={false}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            {selectedCollection?.events.map((event: any) => (
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