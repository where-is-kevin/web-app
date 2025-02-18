import {create} from "zustand";
import { devtools, persist } from 'zustand/middleware'
import {EventInterface} from "@/types/EventInterface";
import axiosInstance from "@/utils/axiosInstance";

interface EventTimelineState {
    currentDate: Date
    selectedDate?: Date
    setSelectedDate: (date: Date) => void
    events: EventInterface[]
    setEvents: (events: EventInterface[]) => void
    loading: boolean
    fetchEvents: (date: Date) => Promise<void>;
    reset: () => void
}


const useEventTimelineStore = create<EventTimelineState>()(
    devtools(
        persist(
            (set, get) => ({
                events: [],
                currentDate: new Date(),
                loading: true,
                setSelectedDate: (date: Date) => {set(() => ({
                    selectedDate: date
                }))},
                reset: () => {
                    set(() => ({
                        events: [],
                        loading: false,
                        currentDate: new Date(),
                    }))
                },
                setEvents: (events: EventInterface[]) => {
                    set(() => ({
                        events: events,
                    }))
                },
                fetchEvents: async (date: Date) => {
                    set({loading: true});
                    try {
                        const response = await axiosInstance.post("/api/v2/user/timeline/read", {
                            date
                        });
                        set({events: response.data.data.rows, loading: false});
                    } catch (error) {
                        console.error(error);
                        set({loading: false});
                    }
                    set({loading: false});
                }
            }),
            {
                name: 'eventTimeline-storage'
            }
        )
    )
)

export default useEventTimelineStore