import {SwipeRight} from "@/components/animations/SwipeRight";
import React, {useEffect, useState} from "react";
import {SwipeLeft} from "@/components/animations/SwipeLeft";

export const SwipeHints = () => {


    const [showNext, setShowNext] = useState(false)

    useEffect(() => {
        window.addEventListener('animation-swipe-right-finished', function(){
            setShowNext(true)
        })
    }, []);

    return (
        <>

            <SwipeRight/>

            {showNext &&
                <SwipeLeft/>

            }
        </>
    );
};