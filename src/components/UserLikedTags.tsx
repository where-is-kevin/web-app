import {useEffect, useState} from "react";
import {UserService} from "@/lib/service/UserService";

interface TagInterface {
    id: string
    label: string
}
export const UserLikedTags = () => {

    const randomBg = [
        'bg-[#F587E0]',
        'bg-[#3200B9]',
        'bg-[#F84808]',
        'bg-primary-1000',
    ]
    function getRandomBgColor() {
        // Select a random color from the randomBg array
        return randomBg[Math.floor(Math.random() * randomBg.length)];
    }

    const [tags, setTags] = useState<TagInterface[]|null>(null)

    useEffect(() => {
        UserService.readTagScores().then(res => {
            setTags(res)
        })

    }, [])

    return (
        <>
            <div className={'flex gap-3 flex-wrap gap-x-3 gap-y-1.5 max-h-[95px] overflow-hidden'}>
                {tags?.map((tag: TagInterface) => <>
                    <div className={`rounded-xl  px-3 py-1.5 text-nowrap text-[10px] font-semibold text-[#CCFF3A] ` + getRandomBgColor()} key={tag.id}>
                        {tag.label}
                    </div>
                </>)}
            </div>
        </>
    );
};