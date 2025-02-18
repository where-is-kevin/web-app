'use client'

import {Avatar, Button, Label, Spinner, Textarea, TextInput} from "flowbite-react";
import React, {ChangeEvent, Suspense, useEffect, useRef, useState} from "react";
import useUserStore from "@/stores/user.store";
import {UserLikedTags} from "@/components/UserLikedTags";
import {useForm} from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import {useRouter} from "next/navigation";

export default function Page() {
    const {
        register,
        formState: {errors},
        handleSubmit,
        getValues,
        setValue
    } = useForm();

    const updateProfile = async () => {

        setIsLoading(true)
        const values = getValues()
        await axiosInstance.post('/api/v2/user/update', {
            userData: {
                aboutYou: [],
                home: values.home,
                travelDestination: values.travelDestination,
                firstName: values.firstName,
                lastName: values.lastName,
                about: values.about,
            }
        })

        userStore.setAbout(values.about)

        setIsLoading(false)

    }
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const userStore = useUserStore()
    const onSubmit = () => {}
    const openFileChooser = () => {
        fileInputRef.current?.click();
    };

    const userImage = () => {

        return selectedImage ? <img className={'rounded-full aspect-square object-cover'} src={selectedImage} width={120} alt={'User avatar'}/>
            :
            <div className={'rounded-full relative overflow-hidden bg-gray-100 dark:bg-gray-600'}>
                <svg className="absolute-bottom-1 h-auto w-auto text-gray-400" width={'120'} height={'120'}
                     fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"></path>
                </svg>
            </div>
    }

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);

            axiosInstance.post('/api/v2/user/picture/create', {
                image: await toBase64(file)
            })
        } else {
            console.log('image removed')

            // @todo delete image from profile
        }
    };

    useEffect(() => {
        userStore.fetchInformation()

        if (userStore.image) {
            setSelectedImage(userStore.image)
        }

        if (userStore.firstName) {
            setValue('firstName', userStore.firstName)
        }
        else {
            userStore.fetchInformation()
        }

        if (userStore.lastName) {
            setValue('lastName', userStore.lastName)
        }

        if (userStore.home) {
            setValue('home', userStore.home)
        }

        if (userStore.travelDestination) {
            setValue('home', userStore.travelDestination)
        }
        if (userStore.about) {
            setValue('about', userStore.about)
        }
    }, [])


    return <>
        <main className="pb-12">
            <header className="flex gap-5 items-center self-end px-6 w-full bg-white pt-3">
                <svg onClick={() => router.back()} width="16" height="17" viewBox="0 0 16 17" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_2894_1577" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="3" y="0"
                          width="10"
                          height="17">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M12.3654 1.12662C12.7668 1.51713 12.7668 2.15027 12.3654 2.54078L6.24044 8.50011L12.3654 14.4594C12.7668 14.8499 12.7668 15.4831 12.3654 15.8736C11.9641 16.2641 11.3133 16.2641 10.912 15.8736L3.3335 8.50011L10.912 1.12662C11.3133 0.736113 11.9641 0.736113 12.3654 1.12662Z"
                              fill="#006FFD"/>
                    </mask>
                    <g mask="url(#mask0_2894_1577)">
                        <rect x="0.000244141" y="0.499268" width="15.9994" height="15.9994" fill="#5C3CFA"/>
                    </g>
                </svg>
            </header>
            <div className={''}>
                <section className="flex flex-col flex-1items-center  mt-10 w-full">
                    <form className={'w-full'} onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex justify-center w-full" onClick={openFileChooser}
                             style={{cursor: 'pointer', display: 'inline-block'}}>
                            <Avatar
                                img={userImage}
                                rounded
                                size="xl"
                                alt="User profile picture"
                            >
                            </Avatar>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{display: 'none'}}
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="mb-3 flex flex-col gap-y-1.5 w-full">
                            <Label className={'text-gray-700 font-semibold'} htmlFor={'firstName'}>First name</Label>
                            <TextInput id={'firstName'}
                                       placeholder={'Kevin'}
                                       color={'gray'}
                                       disabled={isLoading}
                                       className={`${errors.firstName ? 'border-red-900' : ''}`}

                                       {...register("firstName", {
                                           required: true,
                                       })}
                            ></TextInput>
                            {errors.firstName?.type === 'required' &&
                                <div className={'text-xs text-red-900'}>First name is required</div>}
                        </div>
                        <div className="mb-3 flex flex-col gap-y-1.5 w-full">
                            <Label className={'text-gray-700 font-semibold'} htmlFor={'lastName'}>Last name</Label>
                            <TextInput id={'lastName'}
                                       placeholder={'Kevin'}
                                       color={'gray'}
                                       disabled={isLoading}
                                       className={`${errors.lastName ? 'border-red-900' : ''}`}

                                       {...register("lastName", {
                                           required: true,
                                       })}
                            ></TextInput>
                            {errors.lastName?.type === 'required' &&
                                <div className={'text-xs text-red-900'}>Last name is required</div>}
                        </div>
                        <div className="mb-3 flex flex-col gap-y-1.5">
                            <Label className={'text-gray-700 font-semibold'} htmlFor={'travelDestination'}>Travel
                                Destination</Label>
                            <TextInput id={'travelDestination'}
                                       placeholder={'Lisbon'}
                                       color={'gray'}
                                       className={`${errors.travelDestination ? 'border-red-900' : ''}`}

                                       {...register("travelDestination", {
                                           required: true,
                                       })}
                            ></TextInput>
                            {errors.travelDestination?.type === 'required' &&
                                <div className={'text-xs text-red-900'}>Travel Destination is required</div>}

                        </div>

                        <div className="mb-3 flex flex-col gap-y-1.5">
                            <Label className={'text-gray-700 font-semibold'} htmlFor={'home'}>Home</Label>
                            <TextInput id={'home'}
                                       placeholder={'Lisbon'}
                                       color={'gray'}
                                       className={`${errors.home ? 'border-red-900' : ''}`}

                                       {...register("home", {
                                           required: true,
                                       })}
                            ></TextInput>
                            {errors.home?.type === 'required' &&
                                <div className={'text-xs text-red-900'}>Home is required</div>}

                        </div>

                        <div className="mb-3 flex flex-col gap-y-1.5">
                            <Label className={'text-gray-700 font-semibold'} htmlFor={'home'}>About</Label>
                            <Textarea id={'about'}
                                       placeholder={'Lisbon'}
                                       color={'gray'}
                                       className={`${errors.about ? 'border-red-900' : 'bg-white block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  focus:border-primary-1000 focus:ring-primary-1000 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-1000 dark:focus:ring-primary-1000 p-2.5 rounded-lg text-[16px] text-gray-500'}`}

                                       {...register("about", {
                                           required: false,
                                       })}
                            ></Textarea>
                            {errors.home?.type === 'required' &&
                                <div className={'text-xs text-red-900'}>Home is required</div>}

                        </div>
                    </form>
                </section>

                <div className={'mt-6'}>
                    <UserLikedTags/>
                </div>

            </div>

            <div className={'flex justify-center items-center mt-auto pb-16 pt-6 px-6 w-full'}>
                <Button
                    type={'button'}
                    disabled={isLoading}
                    size={'lg'}
                    onClick={() => updateProfile()}
                    className={'h-9 bg-primary-1000 text-[#F5F5F5] enabled:hover:bg-primary-1000 mt-auto min-h-9 px-3 w-full'}
                    label={'Sign in'}>

                    {isLoading ? <Spinner size={'md'}/> : 'Save'}

                </Button>
            </div>
        </main>
    </>

}