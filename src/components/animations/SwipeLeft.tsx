import animationData from '@/animations/swipe-left-animation.json'
import Lottie from 'react-lottie'
import {useEffect, useState} from "react";

export const SwipeLeft = () => {

    const [isAnimationPaused, setAnimationPaused] = useState(false)

    useEffect(() => {
        window.addEventListener('click', function(){
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
        <div className={'absolute left-0 w-full flex justify-center items-center z-[1500]'}>
            {!isAnimationPaused &&
                <Lottie
                    isPaused={isAnimationPaused}
                    options={defaultOptions}
                    height={400}
                    width={400}
                    eventListeners={[
                        {
                            eventName: 'complete',
                            callback: () => {
                                setAnimationPaused(true)
                                window.dispatchEvent(new CustomEvent('animation-swipe-left-finished'))
                            },
                        },
                    ]}
                />
            }
        </div>
    );
}