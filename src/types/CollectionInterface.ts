import {EventInterface} from "@/types/EventInterface";

export interface CollectionInterface {
    uuid: string
    title: string
    events?: EventInterface[]
    eventIds?: string[]
}