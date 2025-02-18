import {create} from "zustand";
import { devtools, persist } from 'zustand/middleware'
import {EventInterface} from "@/types/EventInterface";
import axiosInstance from "@/utils/axiosInstance";

interface EventState {
    events: EventInterface[]
    setEvents: (events: EventInterface[]) => void
    removeEvent: (uuid: string) => void
    loading: boolean
    fetchEvents: () => Promise<void>;
    reset: () => void
    showHints: boolean
    setShowHints: (show: boolean) => void
}


const useEventStore = create<EventState>()(
    devtools(
        persist(
            (set, get) => ({
                events: [],
                loading: true,
                showHints: true,
                setShowHints: (showHints: boolean) => {
                    set(() => ({
                        showHints: showHints
                    }))
                },
                reset: () => {
                    set(() => ({
                        events: [],
                        loading: false,
                    }))
                },
                setEvents: (events: EventInterface[]) => {
                    set(() => ({
                        events: events,
                    }))
                },
                removeEvent: (uuid: string) => {
                    set((state: EventState) => ({
                        events: state.events.filter((el) => el.uuid !== uuid),
                    }))
                },
                fetchEvents: async () => {
                    if (get().events.length === 0) {
                        set({loading: true});
                        try {
                            const response = await axiosInstance.get("/api/v2/event/recommend");

                            if (response.data.data.length === 0) {
                                // get().fetchEvents()
                            } else {
                            }
                            set({events: response.data.data, loading: false});

                        } catch (error) {
                            console.error(error);
                            set({loading: false});
                        }
                    }
                    set({loading: false});

                }
            }),
            {
                name: 'event-storage'
            }
        )
    )
)

export default useEventStore