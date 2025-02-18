import {Button, Drawer, Label, Modal, TextInput} from "flowbite-react";
import React, {useEffect, useState} from "react";
import useEventEmitterStore from "@/stores/eventEmitter.store";
import {EventInterface} from "@/types/EventInterface";
import axiosInstance from "@/utils/axiosInstance";
import {HttpStatusCode} from "axios";
import {HeartIcon} from "@/components/icons/HeartIcon";
import {CollectionInterface} from "@/types/CollectionInterface";

export const CollectionDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);
    const subscribe = useEventEmitterStore((state) => state.subscribe);
    const unsubscribe = useEventEmitterStore((state) => state.unsubscribe);
    const [openModal, setOpenModal] = useState(false);

    const [collectionTitle, setCollectionTitle] = useState('');

    function onCloseModal() {
        setOpenModal(false);
        setCollectionTitle('');
    }

    const [collections, setCollections] = useState<CollectionInterface[]>([])

    const [eventTracked, setEventTracked] = useState(true)
    const publish = useEventEmitterStore((state) => state.publish);

    const trackEvent = () => {
        if (!eventTracked) {
            publish('trackEvent', {event: event});
        }

        axiosInstance.post('/api/v2/user/track/event', {
            uuid: event?.uuid,
        }).then(() => {
            setEventTracked(!eventTracked)
        })

    }

    const [event, setEvent] = useState<EventInterface | null>(null)


    useEffect(() => {
        const handleCustomEvent = (data: { event: EventInterface }) => {
            setEvent(data.event)
            setIsOpen(true)
        }

        subscribe('trackEvent', handleCustomEvent);

        return () => {
            unsubscribe('trackEvent', handleCustomEvent);
        };
    }, [subscribe, unsubscribe]);


    // Get current collections created by user
    useEffect(() => {

        axiosInstance.get('/api/v2/collection/read').then(res => {

            if (res.status === HttpStatusCode.Ok) {
                setCollections(res.data.payload?.collections)
            }
        })

        return () => {
        }

    }, []);


    const createNewCollection = () => {
        setOpenModal(true)
    }

    const addNodeToCollection = async (collectionId: string) => {

        if (!event?.uuid) {
            return
        }

        const updatedCollections = collections?.map((collection: CollectionInterface) => {

            if (collection?.eventIds && collection.uuid === collectionId && event?.uuid) {
                if (collection?.eventIds && collection.eventIds.includes(event?.uuid)) {
                    // Remove the event from the array
                    collection.eventIds = collection.eventIds.filter((uuid: string) => uuid !== event?.uuid);
                } else {
                    // Add the event to the array
                    collection.eventIds.push(event?.uuid ?? '');
                }
            }

            return collection;
        });

        setCollections(updatedCollections ?? []);

        const response = await axiosInstance.post('/api/v2/collection/add', {
            collectionId,
            eventId: event?.uuid,
        })

        console.log(response)
    }

    const saveCollection = async () => {

        const response = await axiosInstance.post('/api/v2/collection/create', {
            collectionTitle: collectionTitle,
        })

        if (response.status === 200) {
            setOpenModal(false)
            collections?.push(response.data.payload.collection)
            setCollections(collections)
            setCollectionTitle('')
        }
    }

    return (
        <>
            <Modal className="z-[10000] dialog-center w-full" show={openModal} size="sm" onClose={onCloseModal} position="center">
                <Modal.Header className="px-3 py-2 text-lg font-medium text-primary-1000 dark:text-white"
                              title="Create new collection">
                    Create new collection
                </Modal.Header>
                <Modal.Body className="px-0 pt-2">
                    <div className="px-3 py-0">
                        <div>
                            <div className="mb-3 flex flex-col gap-y-1.5 w-full">
                                <Label className={'text-gray-700 font-semibold'} htmlFor={'collectionTitle'}>
                                    Collection title
                                </Label>
                                <TextInput id={'collectionTitle'}
                                           value={collectionTitle}
                                           onChange={(event) => setCollectionTitle(event.target.value)}
                                           color={'gray'}
                                ></TextInput>
                            </div>

                        </div>
                        <div className="w-full flex justify-end mt-3">
                            <Button
                                size="lg"
                                type={'button'}
                                disabled={collectionTitle.length < 3}
                                className="h-9 bg-primary-1000 text-[#F5F5F5] enabled:hover:bg-primary-1000 mt-auto min-h-9 px-3"
                                onClick={saveCollection}>
                                Create new collection
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Drawer className="z-[9000] rounded-t-3xl p-0" open={isOpen} onClose={handleClose} position="bottom">
                <Drawer.Items className="mt-3 text-sm">
                    <div className="flex justify-between items-center p-4">
                        <span className="text-sm font-semibold px-2">Saved to private collection</span>
                        <div onClick={() => trackEvent()} className={'absolute right-5 top-4'}>
                            <HeartIcon width={'100'} height={'100'} viewBox={'2222'}
                                       fill={eventTracked ? 'rgba(92, 60, 250, 1)' : 'rgba(92, 60, 250, .5)'}
                                       stroke={''}/>
                        </div>
                    </div>
                    <div className="px-4 pt-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-sm font-semibold">Collections</span>
                            <span onClick={createNewCollection} className="text-xs text-primary-1000 font-semibold">New collection</span>
                        </div>

                        {collections.length > 0 ?
                            <div className="px-2 max-h-[38vh] overflow-y-auto">
                                {collections.map((collection: CollectionInterface) => (
                                    <div key={collection.uuid}>
                                        <div className="py-2.5 flex items-center justify-between">
                                            <span className="text-xs font-semibold">
                                                {collection.title}
                                            </span>
                                            <div onClick={() => addNodeToCollection(collection.uuid)}>
                                                {event?.uuid && collection?.eventIds?.includes(event?.uuid) ?
                                                    (
                                                        <>
                                                            <svg className="w-6 h-6 text-gray-800 dark:text-white"
                                                                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                                 width="24" height="24" fill="black"
                                                                 viewBox="0 0 24 24">
                                                                <path fillRule="evenodd"
                                                                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                        </>

                                                    )

                                                    :

                                                    <svg
                                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        fill="none"
                                                        viewBox="0 0 24 24">
                                                        <path stroke="rgb(113, 113, 113)" strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth="2"
                                                              d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                                    </svg>
                                                }

                                            </div>
                                        </div>
                                        <hr/>
                                    </div>
                                ))}
                            </div>

                            : <div className="text-xs pt-3">
                                No collections yet
                            </div>}

                    </div>

                </Drawer.Items>
            </Drawer>
        </>
    );
};