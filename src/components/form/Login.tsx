 'use client'

import {Button, Label, Spinner, TextInput} from "flowbite-react"
import React, {FormEvent, useEffect, useState} from "react"
import {setCookie} from "cookies-next"
import {useRouter} from "next/navigation"
import axiosInstance from "@/utils/axiosInstance"
import {OAuthResponse} from "@/services/authService"
import {HttpStatusCode} from "axios"
import Image from "next/image"
import {useForm} from "react-hook-form";
import {useToast} from "@/context/ToastContext";
import useQuestionnaireStore from "@/stores/questionnaire.store";
import {Logo} from "@/components/Logo";

export default function Login() {
    const toast = useToast()

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
        getValues,
    } = useForm();
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const { questionnaireData, setQuestionnaireData } = useQuestionnaireStore()

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post<OAuthResponse>('/oauth/token', {
                grant_type: 'password',
                username: getValues().username,
                password: getValues().password,
                client_id: 'default_consumer',
                client_secret: 'd37a403c',
            });

            if (response.status !== HttpStatusCode.Ok) {
                return
            }

            setCookie('access_token', response.data.access_token, {
                httpOnly: false,
                sameSite: 'strict',
                path: '/',
                maxAge: response.data.expires_in,
            })

            setCookie('refresh_token', response.data.refresh_token, {
                httpOnly: false,
                sameSite: 'strict',
                path: '/',
            })

            router.push('/user/profile')
        } catch (e) {
            setIsLoading(false)
            toast.addToast('Your credentials are wrong. Please check your input and try again.', 'error')
            return
        }
    }

    const username = watch("username")
    useEffect(() => {
        if (questionnaireData === null || questionnaireData === undefined) {
            return
        }
        questionnaireData.email = username
        setQuestionnaireData(questionnaireData)

    }, [username, questionnaireData, setQuestionnaireData]);
    watch("password")
    return (
        <>
            <div className="container flex flex-col h-100 h-full font-ppmori">
                <div className={'flex justify-center items-center mt-[74px]'}>
                    <Logo />
                </div>
                <div className={'text-[#757575] text-center mt-6 text-md mb-10'}>
                    Welcome back!
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3 flex flex-col gap-y-[6px]">
                        <Label className={'text-gray-700 font-semibold'} htmlFor={'username'}>Email</Label>
                        <TextInput id={'username'}
                                   disabled={isLoading}
                                   {...register("username", {
                                       required: true, pattern: {
                                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                           message: 'Please enter valid email address',
                                       },
                                   })}
                                   placeholder={'contact@whereiskevin.com'}
                                   color={'gray'}
                        ></TextInput>
                        {errors.username?.type === 'pattern' &&
                            <div className={'text-xs text-red-900'}>Please enter valid email address</div>}
                        {errors.username?.type === 'required' &&
                            <div className={'text-xs text-red-900'}>Email is required</div>}
                        {errors.username?.type === 'minLength' &&
                            <div className={'text-xs text-red-900'}>Must be at least 8 characters</div>}
                    </div>
                    <div className="mb-3 flex flex-col gap-y-[6px]">
                        <Label className={'text-gray-700 font-semibold'} htmlFor={'password'}>Password</Label>
                        <TextInput id={'password'}
                                   placeholder={'************'}
                                   disabled={isLoading}
                                   className={`${errors.password ? 'border-red-900' : ''}`}
                                   type={'password'}
                                   {...register("password", {required: true})}
                        ></TextInput>
                        {errors.password?.type === 'required' &&
                            <div className={'text-xs text-red-900'}>Password is required</div>}

                    </div>
                    <div className="mb-6 flex flex-col">
                        <a className={'text-primary-1000 text-xs font-semibold'} href={'/forgot-password'}>
                            Forgot password?
                        </a>
                    </div>
                    <div className="mb-6 px-6">
                        <Button
                            type={'submit'}
                            size={'lg'}
                            className={'h-9 bg-primary-1000 text-[#F5F5F5] w-full enabled:hover:bg-primary-1000 mt-auto min-h-9'}
                            label={'Sign in'}>
                            {isLoading ? <Spinner size={'md'}/> :
                                <>
                                    Sign in
                                </>

                            }

                        </Button>
                    </div>
                </form>

                <div className={'text-center text-gray-500 mb-6 text-xs'}>
                    Not a member? <a className={'text-primary-1000 font-semibold text-xs'} href={'/register'}>Sign up</a>
                </div>

                {/*<hr/>*/}

                {/*<div className={'text-center text-gray-500 mb-4 mt-6 text-xs'}>*/}
                {/*    Other ways to Sign in*/}
                {/*</div>*/}

                {/*<div className={'text-center'}>*/}
                {/*    <Button></Button>*/}
                {/*</div>*/}
            </div>
        </>
    );
}