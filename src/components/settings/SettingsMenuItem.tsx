import React from 'react';
import {ChevronRight} from "@/components/icons/ChevronRight";

interface SettingsMenuItemProps {
    label: string;
    className?: string
    onClick?: () => void
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({label, className, onClick}) => {
    return (
        <div onClick={onClick} className="flex gap-4 items-center p-4 w-full whitespace-nowrap">
            <div className={`flex-1 text-[#1F2024] text-sm shrink self-stretch my-auto ${className ?? ''}`}>
                {label}
            </div>
            <ChevronRight />
        </div>
    );
};

export default SettingsMenuItem;