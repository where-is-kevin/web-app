import { create } from 'zustand';

type EventCallback<T = any> = (data: T) => void;

interface EventEmitterStore {
    events: Record<string, EventCallback[]>;
    subscribe: <T = any>(eventName: string, callback: EventCallback<T>) => void;
    unsubscribe: <T = any>(eventName: string, callback: EventCallback<T>) => void;
    publish: <T = any>(eventName: string, data: T) => void;
}

const useEventEmitterStore = create<EventEmitterStore>((set, get) => ({
    events: {},

    subscribe: (eventName, callback) => {
        const { events } = get();
        set({
            events: {
                ...events,
                [eventName]: [...(events[eventName] || []), callback],
            },
        });
    },

    unsubscribe: (eventName, callback) => {
        const { events } = get();
        set({
            events: {
                ...events,
                [eventName]: (events[eventName] || []).filter((cb) => cb !== callback),
            },
        });
    },

    publish: (eventName, data) => {
        const { events } = get();
        (events[eventName] || []).forEach((callback) => {
            callback(data);
        });
    },
}));

export default useEventEmitterStore;
