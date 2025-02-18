import {useRouter} from "next/navigation";

interface EventHeaderProps {
    title: string;
    date: string;
}


export const EventHeader: React.FC<EventHeaderProps> = ({title, date}) => {

    const router = useRouter()

    return (
        <header className="flex gap-5 items-center self-end px-6 w-full bg-white pt-3">
            <svg onClick={() => router.back()} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_2894_1577" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="3" y="0" width="10"
                      height="17">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M12.3654 1.12662C12.7668 1.51713 12.7668 2.15027 12.3654 2.54078L6.24044 8.50011L12.3654 14.4594C12.7668 14.8499 12.7668 15.4831 12.3654 15.8736C11.9641 16.2641 11.3133 16.2641 10.912 15.8736L3.3335 8.50011L10.912 1.12662C11.3133 0.736113 11.9641 0.736113 12.3654 1.12662Z"
                          fill="#006FFD"/>
                </mask>
                <g mask="url(#mask0_2894_1577)">
                    <rect x="0.000244141" y="0.499268" width="15.9994" height="15.9994" fill="#5C3CFA"/>
                </g>
            </svg>

            <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-0 min-w-[240px]">
                <h1 className="text-lg tracking-normal text-neutral-800 leading-tight">{title}</h1>
                {!date.includes('Invalid') &&
                    <p className="mt-1 text-xs tracking-normal leading-none text-zinc-500">{date}</p>
                }
            </div>
        </header>
    )
};