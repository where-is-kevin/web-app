import React, {useState, useEffect, useRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import dayjs, {Dayjs} from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import useEventTimelineStore from "@/stores/eventTimeline.store";

dayjs.extend(weekday);

interface Day {
    date: Dayjs;
    isCurrentMonth: boolean;
}

const DaysSlider: React.FC = () => {
    const [days, setDays] = useState<Day[]>([]);
    const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
    const swiperRef = useRef<SwiperCore>();
    const {selectedDate, setSelectedDate} = useEventTimelineStore(state => state)

    useEffect(() => {
        loadDaysForCurrentMonth();
    }, [currentMonth]);

    useEffect(() => {

        if (selectedDate === undefined || selectedDate === null) {
            return
        }

        if (!(selectedDate instanceof Date)) {
            return
        }

        if (selectedDate.getMonth() !== currentMonth.month()) {
            setCurrentMonth(dayjs(selectedDate))
        }


        if (swiperRef.current) {
            swiperRef.current.slideTo(selectedDate.getDate() - 4, 500);
        }

    }, [selectedDate]);

    const loadDaysForCurrentMonth = () => {
        const daysArray: Day[] = [];
        const daysInMonth = currentMonth.daysInMonth();

        // Add all days of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push({
                date: currentMonth.date(i),
                isCurrentMonth: true,
            });
        }

        setDays(daysArray);
    };

    const handleDayClick = (day: Day, index: number) => {
        setSelectedDate(day.date.toDate());
        if (swiperRef.current) {
            swiperRef.current.slideTo(index - 3, 500);
        }

    };

    // const changeMonth = (direction: 'next' | 'prev') => {
    //     setCurrentMonth((prev) =>
    //         direction === 'next' ? prev.add(1, 'month') : prev.subtract(1, 'month')
    //     );
    // };

    return (
        <div>
            <Swiper
                spaceBetween={12}
                slidesPerView={7}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {days.map((day, index) => (
                    <SwiperSlide key={index} onClick={() => handleDayClick(day, index)}>
                        <div
                            style={{
                                fontWeight: dayjs(selectedDate)?.isSame(day.date, 'day') ? 'bold' : 'normal',
                                backgroundColor: dayjs(selectedDate)?.isSame(day.date, 'day') ? '#F84808' : 'transparent',
                                padding: '8px',
                                textAlign: 'center',
                                borderRadius: '10px',
                            }}
                        >
                            <div style={{
                                color: dayjs(selectedDate)?.isSame(day.date, 'day') ? 'white' : '#A3A3A8',
                            }} className={'font-semibold text-xs'}>{day.date.format('dd')}</div>
                            {/* Day name (e.g., Mon) */}
                            <div style={{
                                color: dayjs(selectedDate)?.isSame(day.date, 'day') ? 'white' : '#4A4A4F',
                            }} className={'font-semibold text-xs'}>{day.date.format('D')}</div>
                            {/* Day name (e.g., Mon) */}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default DaysSlider;
