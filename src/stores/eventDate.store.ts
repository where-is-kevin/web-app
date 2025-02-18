import {create} from "zustand";
import { devtools, persist } from 'zustand/middleware'
import {EventInterface} from "@/types/EventInterface";
import axiosInstance from "@/utils/axiosInstance";

interface EventTimelineState {
    eventDates: string[]
    setEventDates: (eventDates: string[]) => void
    reset: () => void
    loading: boolean
    fetchEventDates: () => Promise<void>
}


const useEventDateStore = create<EventTimelineState>()(
    devtools(
        persist(
            (set, get) => ({
                eventDates: [],
                currentDate: new Date(),
                loading: true,
                fetchEventDates: async () => {
                    set({loading: true});
                    try {
                        const response = await axiosInstance.get("/api/v2/event/dates/read");
                        set({eventDates: response.data.data.rows, loading: false});
                    } catch (error) {
                        console.error(error);
                        set({loading: false});
                    }
                },
                setEventDates: (dates: string[]) => {set(() => ({
                    eventDates: dates
                }))},
                reset: () => {
                    set(() => ({
                        eventDates: [],
                        loading: false,
                    }))
                },
            }),
            {
                name: 'eventDate-storage'
            }
        )
    )
)

export default useEventDateStore