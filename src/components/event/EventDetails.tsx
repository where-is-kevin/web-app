import {Tag, TagProps} from "@/components/event/Tag";
import {EventInterface} from "@/types/EventInterface";
import {Button} from "flowbite-react";
import useEventStore from "@/stores/event.store";
import useQuestionnaireStore from "@/stores/questionnaire.store";
import React from "react";
import axiosInstance from "@/utils/axiosInstance";
import {useRouter} from "next/navigation";

interface EventDetailsProps {
    event?: EventInterface | null
    hideButtons?: boolean

    tags: Array<{

        text: string;
        bgColor: string;
    }>;

}


export const EventDetails: React.FC<EventDetailsProps> = ({event, tags, hideButtons}: EventDetailsProps) => {

    const router = useRouter()

    const {events, setEvents} = useEventStore()

    const {progress, setProgress, questionnaireData} = useQuestionnaireStore()
    const handleEventLike = (uuid: string, like: boolean) => {

        setEvents(events.filter((event: EventInterface) => {
            return event.uuid !== uuid
        }))

        axiosInstance.post('/api/v2/event/like', {
            uuid: event?.uuid,
            like: like,
        })

        if (like && event?.uuid && questionnaireData?.likedEvents) {
            questionnaireData.likedEvents.push(event?.uuid)

            if (event.originalUrl) {
                window.open(event?.originalUrl, '_blank')
            }

            return
        }

        if (questionnaireData?.likedEvents && event?.uuid) {
            questionnaireData.dislikedEvents.push(event?.uuid)
        }
        setProgress(progress + 5)

        router.back()
    }

    return (
        <section className="container flex flex-col flex-1 pt-3 pb-6 mt-3 w-full bg-white font-ppmori">
            <div className="flex flex-col flex-1 w-full">
                <div className="flex justify-between items-start w-full font-semibold">
                    <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
                        {event?.match &&
                            <p className="text-2xl tracking-wide leading-none text-[#F84808]">{event?.match} Match</p>
                        }
                        <p className="mt-2 text-base tracking-normal leading-none text-neutral-800 ">{event?.address}</p>
                        {event?.price &&
                            <p className="mt-2 text-sm leading-none text-zinc-500">{event?.price}</p>
                        }
                    </div>
                </div>

                {hideButtons === false &&
                    <div
                        className="my-3.5 flex gap-3 items-start  w-full text-xs font-semibold leading-none text-neutral-100">
                        <Button onClick={() => handleEventLike(event?.uuid ?? '', false)}
                                className="h-10 bg-red-500 text-[#F5F5F5] enabled:hover:bg-primary-1000 mt-auto min-h-10">
                            Decline
                        </Button>

                        <Button onClick={() => handleEventLike(event?.uuid ?? '', true)}
                                className="h-10 bg-primary-1000 text-[#F5F5F5] enabled:hover:bg-primary-1000 mt-auto min-h-10 w-full">
                            Book
                        </Button>
                    </div>
                }


                {event?.hostedBy &&
                    <div className={'flex flex-col'}>
                        <span
                            className={'text-[10px] font-semibold text-[#A3A3A8] text-almost-black mb-1.5'}>HOSTED BY</span>
                        <span className={'text-[#131314] text-[12px] font-semibold'}>{event.hostedBy}</span>
                    </div>
                }

                <div className="flex flex-col mt-3.5 w-full">
                    <h2 className="text-xs font-semibold tracking-wide uppercase text-neutral-400">About</h2>
                    <p className="mt-2 text-xs tracking-normal leading-4 text-zinc-500 limit-paragraph-4">{event?.body}</p>
                </div>


                {event?.tags?.length &&
                    <div
                        className="flex gap-3 items-center mt-3.5 w-full text-xs flex-wrap font-semibold tracking-wide text-center text-lime-300 uppercase">
                        {event?.tags?.map((tag: TagProps, index) => (
                            <Tag id={tag.id} key={tag.id} name={tag.name} bgColor={tag.bgColor}/>
                        ))}
                    </div>
                }

            </div>
        </section>
    );

};