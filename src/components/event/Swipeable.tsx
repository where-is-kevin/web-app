import React, {useState} from 'react'
import {useSprings, animated} from '@react-spring/web'
import {useDrag} from '@use-gesture/react'
import 'react-calendar/dist/Calendar.css';
import './../../app/user/calendar/calendar.css'
import styles from './styles.module.css'
import {EventCard} from "@/components/event/EventCard";
import useQuestionnaireStore from "@/stores/questionnaire.store";
import {EventInterface} from "@/types/EventInterface";
import useEventStore from "@/stores/event.store";
import {Button, Modal} from "flowbite-react";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import axiosInstance from "@/utils/axiosInstance";
import {CollectionDrawer} from "@/components/event/CollectionDrawer";
// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: -10 + Math.random() * 555,
    delay: i * 100,
})
const from = (_: number) => ({x: 0, rot: 0, scale: 1, y: 0})

// This is being used down there in the view, it interpolates rotation and scale into a css transform
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function Deck() {

    const [date, setDate] = useState<Value>(new Date());

    const [time, setTime] = useState(dayjs((new Date())).format('H:mm'))
    const [openDateDialog, setOpenDateDialog] = useState(false)
    const {progress, setProgress, setStepComplete} = useQuestionnaireStore(state => state)

    const [currentEvent, setCurrentEvent] = useState<EventInterface>()
    const {events, setEvents, removeEvent} = useEventStore(state => state)

    const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
    const [props, api] = useSprings(events.length, i => ({
        ...to(i),
        from: from(i),
    })) // Create a bunch of springs using the helpers above

    const [filteredProps, setFilteredProps] = useState(props);

    const removeItem = (indexToRemove: number) => {
        setFilteredProps((prev) => prev.filter((_, i) => i !== indexToRemove));
        setStepComplete(0, true)
        // All swipes are gone
        if (filteredProps.length === 1) {
        }
    };

    const handleDayClick = (date: Date) => {
        setDate(date)
    }
    // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
    const bind = useDrag(({
                              event,
                              args: [index],
                              active,
                              movement: [mx, my],
                              direction: [xDir, yDir],
                              velocity: [vx, vy],
                          }) => {

        // const trigger = Math.abs(mx) > 100 || Math.abs(my) > 100 // If you flick hard enough it should trigger the card to fly out
        const trigger = Math.abs(mx) > 100 // If you flick hard enough it should trigger the card to fly out
        if (!active && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
        api.start(i => {
            if (index !== i) return // We're only interested in changing spring-data for the current spring


            const isGone = gone.has(index)
            const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
            const rot = mx / 100 + (isGone ? xDir * 5 * vx : 0) // How much the card tilts, flicking it harder makes it rotate faster
            const scale = active ? 1.1 : 1 // Active cards lift a bit
            const y = isGone ? (window.innerHeight - 100) * yDir : active ? my : 0

            if (isGone) {

                setProgress(progress + 5)

                const event = events.at(index)
                setTimeout(function () {
                    removeItem(i)
                    if (event?.uuid) {
                        removeEvent(event?.uuid)
                    }
                }, 300)
                // If mx < my then we swiped in Y axis
                if (Math.abs(mx) < Math.abs(my)) {
                    if (yDir === -1) {
                        // console.log('UP')
                    } else {
                        // console.log('DOWN')

                    }
                } else {
                    if (xDir === -1) {
                        // Swiped left, dislike event.
                        // if (questionnaireData?.dislikedEvents !== null && event !== undefined) {
                        //     questionnaireData?.dislikedEvents.push(event.uuid)
                        // }
                    } else {

                        axiosInstance.post('/api/v2/event/like', {
                            uuid: event?.uuid,
                            like: xDir !== -1,
                        })
                        //
                        // // Swiped right, like event.
                        // if (event?.type === 'event') {
                        //     // Like or dislike event based on swipe direction
                        //     axiosInstance.post('/api/v2/event/like', {
                        //         uuid: event?.uuid,
                        //         like: xDir !== -1,
                        //     })
                        // } else {
                        //     if (event) {
                        //         setCurrentEvent(event)
                        //     }
                        //     setOpenDateDialog(true)
                        // }
                    }
                }

                if (progress === 95) {
                    setStepComplete(2, true)
                    setStepComplete(3, true)
                }
            }

            return {
                x: x,
                y,
                rot,
                scale,
                delay: undefined,
                config: {friction: 50, tension: active ? 900 : isGone ? 200 : 500},
            }
        })
        if (!active && gone.size === events.length)
            setTimeout(() => {
                gone.clear()
                api.start(i => to(i))
            }, 600)
    }, {})

    const saveDatetime = () => {
        const hours = parseInt(time.split(":")[0], 10);
        const minutes = parseInt(time.split(":")[1], 10);
        const dayjsDate = dayjs(date as Date);
        const dateTime = dayjsDate.hour(hours).minute(minutes);
        const formattedDateTime = dateTime.format("YYYY-MM-DD\THH:mm:ss");
        axiosInstance.post('/api/v2/venue/reserve', {
            uuid: currentEvent?.uuid,
            like: true,
            date: formattedDateTime,
        }).then(() => {
            setOpenDateDialog(false)
        })
    }

    // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
    return (
        <>
            {filteredProps.map(({x, y, rot, scale}, i) => (
                <animated.div className={styles.deck} key={i} style={{x, y}}>
                    {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
                    <animated.div
                        {...bind(i)}
                        className={'absolute top-0 t-0 '}
                        style={{
                            // transform: interpolate([rot, scale], trans),
                            // backgroundImage: `url(${events[i]})`,
                        }}
                    >
                        <EventCard event={events[i] ?? null}/>

                    </animated.div>
                </animated.div>
            ))}


            <Modal className={'dialog-center z-[3000]  p-1'} show={openDateDialog} size="lg" popup
                   onClose={() => setOpenDateDialog(false)}>
                <Modal.Body className={'p-3'}>
                    <div className="">
                        <p className={'font-ppmori text-sm color-[#131313] font-semibold text-center mb-3'}>
                            Select date and time
                        </p>

                        <Calendar
                            formatShortWeekday={(locale, date) => ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][date.getDay()]}
                            next2Label={<></>}
                            prev2Label={<></>}
                            onClickDay={handleDayClick}
                        />
                        <div className="relative z-[8000]">
                            <div
                                className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                            <input type="time" id="time"
                                   step="60"
                                   value={time}
                                   onChange={(ev) => {
                                       setTime(ev.target.value)
                                   }}
                                   className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required/>
                        </div>

                        <div className={'px-6 pt-5'}>
                            <Button
                                type={'button'}
                                onClick={saveDatetime}
                                size={'lg'}
                                className={'h-9 bg-primary-1000 text-[#F5F5F5] w-full enabled:hover:bg-primary-1000 mt-auto min-h-9'}
                                label={'Confirm'}>
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default function Swipeable({events}: { events: EventInterface[] }) {

    // const animationRef = useRef<any>(null)
    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationData,
    //     rendererSettings: {
    //         preserveAspectRatio: "xMidYMid slice"
    //     }
    // };
    // const stopAnimation = () => {
    //     console.log('stop animations' +
    //         '')
    //     // if (animationRef.current !== null) {
    //     //     animationRef.current.stop()
    //     //     animationRef.current.destroy()
    //     // }
    //
    //     window.removeEventListener('click', stopAnimation)
    //     window.removeEventListener('touchstart', stopAnimation)
    //     window.removeEventListener('touchmove', stopAnimation)
    //
    // }
    //
    // window.addEventListener('click', stopAnimation)
    // window.addEventListener('touchstart', stopAnimation)
    // window.addEventListener('touchmove', stopAnimation)
    return (
        <>
            <div className={`flex fill items-center justify-center ${styles.container}`}>
                <Deck/>
            </div>

            <CollectionDrawer/>
        </>
    )
}
