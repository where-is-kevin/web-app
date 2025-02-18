'use client'

import {useEffect, useState} from "react";
import axiosInstance from "@/utils/axiosInstance";
import {useRouter} from "next/navigation";
import {Spinner} from "flowbite-react";

const Page = ({params}: { params: { slug: string } }) => {

    const router = useRouter()

    const [isLoading, setLoading] = useState(true)

    useEffect(() => {

        axiosInstance.post('/api/v2/user/activate', {
            token: decodeURIComponent(params.slug),
        }).then(() => {
            setLoading(false)
            setTimeout(function(){
                router.push('/login')
            }, 3000)
        })


    }, [])

    if (isLoading) {
        return <>

        <div className={'flex justify-center items-center flex-col h-screen font-ppmori font-xl font-semibold gap-2'}>
            <p>Account is being activated, please wait...</p>
            <br />
            <Spinner className={'fill-primary-1000'} size={'xl'}/>
        </div>
        </>
    }

    return <>

        <div className={'flex justify-center items-center flex-col h-screen font-ppmori font-xl font-semibold'}>
            <p>Account activated! You'll be redirected to login page...</p>
        </div>

    </>

}

export default Page
