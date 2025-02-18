import {IconProps} from "@/types/IconProps";

export const ShareIcon = ({width, height, viewBox, fill, stroke}: IconProps ) => {
    return (
        <>
            <svg width={width} height={height} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M21.4038 3.26298L10.7398 13.927M3.60449 8.56866L20.2104 2.80743C21.233 2.45264 22.2142 3.43377 21.8594 4.4564L16.0981 21.0623C15.7034 22.1999 14.106 22.2311 13.6672 21.1098L11.0303 14.371C10.8986 14.0345 10.6323 13.7682 10.2958 13.6365L3.55703 10.9996C2.43569 10.5608 2.46688 8.96335 3.60449 8.56866Z"
                    stroke={stroke} strokeWidth="2.25" strokeLinecap="round"/>
            </svg>
        </>
    );
};