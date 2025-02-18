import {EventInterface} from "@/types/EventInterface";

import animationData from '@/animations/swipe-right-animation.json'
import Lottie from 'react-lottie'
import {useEffect, useState} from "react";

export const SwipeRight = () => {

    const [isAnimationPaused, setAnimationPaused] = useState(false)

    useEffect(() => {
        window.addEventListener('click', function(){
            console.log('window clicked')

            setAnimationPaused(true)

        })
    }, []);

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className={'absolute w-full left-0 flex justify-center items-center z-[1500]'}>
            {!isAnimationPaused &&
                <Lottie
                    options={defaultOptions}
                    height={400}
                    width={400}
                    eventListeners={[
                        {
                            eventName: 'complete',
                            callback: () => {
                                setAnimationPaused(true)
                                window.dispatchEvent(new CustomEvent('animation-swipe-right-finished'))
                            },
                        },
                    ]}
                />
            }
        </div>
    );
}