'use client'

import React, {useState} from "react";
import 'react-calendar/dist/Calendar.css';
import {Button} from "flowbite-react";

export default function Page() {

    const [activeTab, setActiveTab] = useState("unread")

    return (
        <main>
            <div className={'w-full font-ppmori'}>
                <h1 className={'font-sm font-extrabold text-center mb-6'}>Notifications</h1>
                <Button.Group className={'w-full bg-[#D5CDFE] rounded-[16px] overflow-hidden p-1'}>
                    <Button size={'xs'}
                            onClick={() => setActiveTab('from_kevin')}
                            className={`border-r-0 rounded-[12px] border-0  bg-transparent font-ppmori w-1/3 text-white focus:ring-0 text-xs font-semibold ${activeTab === 'from_kevin' ? ' bg-white text-[#131313] ' : '' } `}
                            color="gray">
                        From Kevin
                    </Button>
                    <Button size={'xs'}
                            onClick={() => setActiveTab('friends')}
                            className={`border-r-0 rounded-[12px] border-0 bg-transparent font-ppmori w-1/3 text-white focus:ring-0 text-xs font-semibold ${activeTab === 'friends' ? ' bg-white text-[#131313] ' : '' } `}
                            color="gray">
                        Friends
                    </Button>
                    <Button size={'xs'}
                            onClick={() => setActiveTab('unread')}

                            className={`focus:bg-white border-0 rounded-[12px] font-ppmori bg-transparent w-1/3 text-white focus:ring-0 focus:text-[#131314] text-xs font-semibold ${activeTab === 'unread' ? ' bg-white text-[#131313] ' : '' } `}
                            color="gray">
                        Unread
                    </Button>
                </Button.Group>

                <div className={'text-center font-ppmori flex items-center justify-center flex-col mt-20'}>
                    <div className={'font-semibold text-[#131313] mb-2'}>
                        All caught up
                    </div>
                    <p className={'text-center font-md text-[#6F6F76]'}>
                        This is where you’ll find your unread notifications
                    </p>
                </div>
            </div>
        </main>
    );

}