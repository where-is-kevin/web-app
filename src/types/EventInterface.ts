export interface EventInterface {
    title: string
    address: string
    match: string
    body: string
    uuid: string
    startTime: string
    endTime?: string
    price: string
    mainImage?: string
    tags?: []
    type: string
    hostedBy: string
    location?: string
    originalUrl?: string
}