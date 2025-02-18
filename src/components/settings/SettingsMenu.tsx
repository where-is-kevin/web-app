'use client'

import React, {useState} from 'react';
import SettingsMenuItem from './SettingsMenuItem';
import {Button, Modal, Spinner} from 'flowbite-react';
import {deleteCookie} from "cookies-next";
import useEventStore from "@/stores/event.store";
import useEventTimelineStore from "@/stores/eventTimeline.store";
import useUserStore from "@/stores/user.store";
import useQuestionnaireStore from "@/stores/questionnaire.store";
import { useTransitionRouter } from "next-transition-router";

interface SettingsItem {
    label: string;
    className?: string
}

const SettingsMenu: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);

    const eventStore = useEventStore()
    const eventTimelineStore = useEventTimelineStore()
    const userStore = useUserStore()
    const questionnaireStore = useQuestionnaireStore()

    const router = useTransitionRouter()

    const confirmLogout = () => {
        setOpenModal(true)
    }

    const logout = () => {

        deleteCookie('access_token')
        deleteCookie('refresh_token')

        questionnaireStore.reset()
        userStore.reset()
        eventTimelineStore.reset()
        eventStore.reset()

        router.push('/login')
    }

    return (
        <>
            <nav className="flex flex-col py-6 w-full text-sm leading-none text-neutral-800">
                <SettingsMenuItem className={'opacity-30 cursor-not-allowed'} label={'Saved Suggestions'}/>
                <hr/>
                <SettingsMenuItem className={'opacity-30 cursor-not-allowed'} label={'Feedback'}/>
                <hr/>
                <SettingsMenuItem className={'opacity-30 cursor-not-allowed'} label={'Devices'}/>
                <hr/>
                <SettingsMenuItem className={'opacity-30 cursor-not-allowed'} label={'Notifications'}/>
                <hr/>
                <SettingsMenuItem className={'opacity-30 cursor-not-allowed'} label={'Appearance'}/>
                <hr/>
                <SettingsMenuItem className={'opacity-30 cursor-not-allowed'} label={'Language'}/>
                <hr/>
                <SettingsMenuItem className={'opacity-30 cursor-not-allowed'} label={'Privacy & Security'}/>
                <hr/>
                <SettingsMenuItem onClick={() => router.push('/user/settings/about')} label={'About app'}/>
                <hr/>
                <SettingsMenuItem onClick={() => confirmLogout()} className={'text-red-1000 '} label={'Log Out'}/>
                <hr/>
            </nav>

            <Modal className={'dialog-center'} position={'center'} show={openModal} size={'md'} onClose={() => setOpenModal(false)}>
                <Modal.Body>
                    <h4 className={'text-center text-md text-extrabold font-extrabold font-ppmori'}>Log out</h4>

                    <div className="space-y-6 text-center font-ppmori mt-6 mb-7">
                        <p className="text-sm leading-relaxed text-[#71727A]">Are you sure you want
                            to log out? You'll need to login again to use the app.</p>
                    </div>

                    <div className={'flex gap-3'}>
                        <Button color="blue"
                                outline={true}
                                size={'sm'}
                                onClick={() => setOpenModal(false)}
                                className={'bg-primary-1000 border-[#5C3CFA] border text-primary-1000 w-full enabled:hover:bg-primary-1000'}>
                                Cancel
                        </Button>
                        <Button onClick={logout}
                                size={'sm'}
                                className={'bg-primary-1000 text-[#F5F5F5] w-full enabled:hover:bg-primary-1000  border border-primary-1000'}>
                            Log out
                        </Button>
                    </div>
                </Modal.Body>

            </Modal>

        </>
    );
};

export default SettingsMenu;