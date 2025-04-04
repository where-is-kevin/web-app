import * as React from "react";
import {Avatar} from "flowbite-react";
import {CalendarIcon} from "@/components/icons/CalendarIcon";
import {BellIcon} from "@/components/icons/BellIcon";
import {CogIcon} from "@/components/icons/CogIcon";
import { ChatIcon } from "./icons/Chat";
import Link from "next/link";
import useUserStore from "@/stores/user.store";

interface NavigationItem {
    icon: string;
    label: string;
    isActive?: boolean;
}

export function BottomBar() {

    const userStore = useUserStore()

    const userImage = () => {
        return userStore.image ? <img className={'rounded-full object-cover aspect-square'} src={userStore.image} width={24} alt={'User avatar'}/>
            :
            <div className={'rounded-full relative overflow-hidden bg-gray-100 dark:bg-gray-600'}>
                <svg className="absolute-bottom-1 h-auto w-auto text-gray-400" width={'24px'} height={'24px'}
                     fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"></path>
                </svg>
            </div>
    }
    return (

        <nav id="footer" className="flex overflow-hidden bottom-0 flex-col bg-white fixed pb-1 w-full left-0 font-ppmori z-10">
            <div className={'h-5 bg-[#6F6F76] w-full'}>
            </div>

            <div className={'flex justify-between px-3'}>
                <Link className={'flex flex-col items-center justify-between  py-1.5 w-1/5'} href={'/user/profile/'}>
                    <Avatar
                        img={userImage}
                        rounded
                        className={'max-w-7'}
                        size="xs"
                        alt="User profile picture"
                    >
                    </Avatar>
                    <div className={'text-[11px] text-[#4A4A4F]'}>Profile</div>
                </Link>

                <Link
                    href={'/user/calendar'}
                    className={'text-[11px] text-[#4A4A4F] flex flex-col items-center justify-between py-1.5 gap-1.5 bg-white w-1/5'}>
                    <CalendarIcon/>
                    <div className={'text-[11px] text-[#4A4A4F]'}>Calendar</div>
                </Link>

                <Link href={'/user/recommendations'} className={'text-[11px] text-[#4A4A4F] flex flex-col items-center justify-center mt-[-1rem] w-1/5'}>
                    <img alt={'Where is Kevin - logo'} src={'/images/where-is-kevin--button-circle.png'} width={'66px'}/>
                </Link>


                <Link href={'/user/notifications'}
                    className={'text-[11px] text-[#4A4A4F] flex flex-col items-center justify-between py-2 gap-1.5 bg-white w-1/5'}>
                    <BellIcon/>
                    <div className={'text-[11px] text-[#4A4A4F]'}>Notifications</div>
                </Link>

                <Link href={'/user/chat'}
                    className={'text-[11px] text-[#4A4A4F] flex flex-col items-center justify-between py-2 gap-1.5 bg-white w-1/5'}>
                    <ChatIcon/>
                    <div className={'text-[11px] text-[#4A4A4F]'}>KevinGPT</div>
                </Link>

                <Link href={'/user/settings'}
                    className={'text-[11px] text-[#4A4A4F] flex flex-col items-center justify-between py-2 gap-1.5 bg-white w-1/5'}>
                    <CogIcon/>
                    <div className={'text-[11px] text-[#4A4A4F]'}>Settings</div>
                </Link>


            </div>

        </nav>

    );

}