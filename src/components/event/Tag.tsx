import {useEffect, useState} from "react";

export interface TagProps {
    id: string
    name: string
    bgColor?: string;
}

export const Tag: React.FC<TagProps> = ({ id, name, bgColor }) => {

    const [randomColor, setRandomColor] = useState('bg-[#F587E0]')

    const randomBg = [
        'bg-[#F587E0]',
        'bg-[#3200B9]',
        'bg-[#F84808]',
        'bg-primary-1000',
    ]
    useEffect(() => {
        setRandomColor(getRandomBgColor())
    }, []);
    function getRandomBgColor() {
        // Select a random color from the randomBg array
        return randomBg[Math.floor(Math.random() * randomBg.length)];
    }

    return (
        <div className={`rounded-xl px-3 py-1.5 text-nowrap font-semibold text-[#CCFF3A] text-[10px] ` + randomColor}>{name}</div>
    )

};