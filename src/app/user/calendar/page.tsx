'use client'

import React, {useEffect, useState} from "react";
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import DaysSlider from "@/components/calendar/DaysSlider";
import {EventsTimeline} from "@/components/event/EventsTimeline";
import {FilterIcon} from "@/components/icons/FilterIcon";
import {Button, Modal} from "flowbite-react";
import Calendar from "react-calendar";
import useEventDateStore from "@/stores/eventDate.store";
import dayjs from "dayjs";
import useEventTimelineStore from "@/stores/eventTimeline.store";

type ValuePiece = Date | null;

export default function Page() {

    const [openModal, setOpenModal] = useState(false);
    const [date, setDate] = useState<Date>()
    const {selectedDate, setSelectedDate} = useEventTimelineStore(state => state)

    const {fetchEventDates, eventDates} = useEventDateStore()

    function isSameDay(dateArray: string[], dateObject: Date) {
        const dateStr = dateObject.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'
        return dateArray.includes(dateStr);
    }

    useEffect(() => {
        fetchEventDates().then(res => {
            console.log(eventDates)
        })

    }, []);

    const handleDayClick = (date: Date) => {
        setDate(date)
        // if (!isSameDay(eventDates, date)) {
        //     return
        // }

        // setSelectedDate(date)
    }

    return (
        <main>
            <div className={'flex flex-col justify-end fixed top-[51px] z-[50] pb-1 pt-1 bg-white w-full left-0'}>
                <DaysSlider/>

                <span className={'ms-auto pt-2 pe-7'} onClick={() => setOpenModal(true)}>
                    <FilterIcon/>
                </span>
            </div>
            <div className={'mt-16 relative'}>
                <EventsTimeline/>
            </div>

            <Modal className={'dialog-center w-full'} position={'center'} show={openModal} size={'lg'}
                   onClose={() => setOpenModal(false)}>
                <Modal.Body>
                    <div className="">
                        <Calendar
                            formatShortWeekday={(locale, date) => ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][date.getDay()]}
                            next2Label={<></>}

                            onClickDay={handleDayClick}
                            prev2Label={<></>}
                            tileContent={
                                ({date, view}) => view === 'month'
                                    ? <div className={isSameDay(eventDates, date) ? 'has-events hidden' : ''}></div>
                                    : <div></div>
                            }/>
                    </div>
                    <div className={'flex gap-3 mt-3'}>
                        <Button color="blue"
                                outline={true}
                                size={'sm'}
                                onClick={() => setOpenModal(false)}
                                className={'font-semibold bg-primary-1000 border-[#5C3CFA] border text-primary-1000 w-full enabled:hover:bg-primary-1000'}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            if (date) {
                                setSelectedDate(date)
                            }
                            setOpenModal(false)
                        }}
                                size={'sm'}
                                className={'font-semibold bg-primary-1000 text-[#F5F5F5] w-full enabled:hover:bg-primary-1000  border border-primary-1000'}>
                            Apply
                        </Button>
                    </div>
                </Modal.Body>

            </Modal>

        </main>
    );

}