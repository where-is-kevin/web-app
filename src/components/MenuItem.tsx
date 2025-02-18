import * as React from "react";


interface MenuItemProps {

    icon: string;

    label: string;

    isActive?: boolean;

}


export function MenuItem({ icon, label, isActive }: MenuItemProps) {

    return (

        <button

            className={`flex flex-col flex-1 shrink items-center text-xs leading-none whitespace-nowrap basis-0 ${

                isActive ? 'text-indigo-600' : 'text-neutral-600'

            }`}

            tabIndex={0}

        >

            <img

                loading="lazy"

                src={icon}

                alt=""

                className="object-contain aspect-square w-[23px]"

            />

            <span className="mt-1.5">{label}</span>

        </button>

    );

}