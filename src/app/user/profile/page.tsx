'use client'

import {Avatar} from "flowbite-react";
import React, {useEffect} from "react";
import useUserStore from "@/stores/user.store";
import {TrackedEventsCarousel} from "@/components/event/TrackedEventsCarousel";
import {UserLikedTags} from "@/components/UserLikedTags";
import {LikedEventsCarousel} from "@/components/event/LikedEventsCarousel";
import {EditIcon} from "@/components/icons/EditIcon";
import {useRouter} from "next/navigation";

export default function Page() {

    const userStore = useUserStore()

    const router = useRouter()
    const userImage = () => {
        return userStore.image ? <img className={'rounded-full object-cover aspect-square'} src={userStore.image} width={140} alt={'User avatar'}/>
            :
            <div className={'rounded-full relative overflow-hidden bg-gray-100 dark:bg-gray-600'}>
                <svg className="absolute-bottom-1 h-auto w-auto text-gray-400" width={'140px'} height={'140px'}
                     fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"></path>
                </svg>
            </div>
    }

    useEffect(() => {
        userStore.fetchInformation()
    }, [])

    const editProfile = () => {
        router.push('/user/profile/edit')
    }


    return <>
        <main>
            <div className={'flex gap-5 items-center'}>
                <div className={'w-6/12 flex'}>
                    <Avatar
                        img={userImage}
                        rounded
                        className={'max-w-[100%]'}
                        size="lg"
                        alt="User profile picture"
                    >
                    </Avatar>
                </div>
                <div className={'w-6/12 flex justify-center flex-col'}>
                    <div
                        className={'text-sm font-semibold text-semibold text-[#414651]'}>{userStore.firstName} {userStore.lastName}</div>
                    <div className={'text-sm font-semibold text-semibold text-[#757575]'}>
                        {userStore.home}
                    </div>
                </div>

                <div onClick={editProfile}>
                    <EditIcon />
                </div>
            </div>

            <div className={'mt-6'}>
                <span className={'text-[10px] text-[#6F6F76] font-semibold letter-spacing-1'}>ABOUT</span>
                <p className={'mt-2 text-xs text-[#6F6F76] '}>{userStore.about}</p>
            </div>

            <div className={'mt-6'}>
                <UserLikedTags/>
            </div>

            <div className={'mt-6'}>
                <div className={'flex justify-between items-center px-2 mb-4'}>
                    <span className={'text-[#6F6F76] text-[10px] font-semibold'}
                          style={{letterSpacing: '0.5px'}}>TRACKING</span>
                    <span className={'text-primary-1000 text-xs font-semibold'}>See more</span>
                </div>
                <TrackedEventsCarousel/>
            </div>

            <div className={'mt-6'}>
                <div className={'flex justify-between items-center px-2 mb-4'}>
                    <span className={'text-[#6F6F76] text-[10px] font-semibold'}
                          style={{letterSpacing: '0.5px'}}>SIGNED UP</span>
                    <span className={'text-primary-1000 text-xs font-semibold'}>See more</span>
                </div>
                <LikedEventsCarousel/>
            </div>
        </main>
    </>

}