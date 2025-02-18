import {config} from "@/utils/config";

export default function Page() {

    return <>
        <div className={'flex justify-center items-center font-ppmori font-semibold text-md'}>
            <h2>Current version: {config.version}</h2>
        </div>

    </>
}