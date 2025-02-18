'use client'

import {Button, Checkbox, Label, Spinner, TextInput} from "flowbite-react";
import React, {FormEvent, useEffect, useState} from "react";
import {setCookie} from "cookies-next";
import {useRouter} from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import {OAuthResponse} from "@/services/authService";
import {HttpStatusCode} from "axios";
import Image from "next/image";
import {useForm} from "react-hook-form";
import useQuestionnaireStore from "@/stores/questionnaire.store";
import {useToast} from "@/context/ToastContext";
import {Logo} from "@/components/Logo";

export default function Register() {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
        getValues,
    } = useForm();

    const { questionnaireData, setQuestionnaireData } = useQuestionnaireStore()

    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()
    const onSubmit = async () => {

        setIsLoading(true)
        let response
        try {
            response = await axiosInstance.post<OAuthResponse>('/api/v2/user/create', {
                ...getValues()
            });
        } catch (e) {
            toast.addToast('Email already exists', 'error')
            setIsLoading(false)
            return
        }

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
            maxAge: response.data.expires_in,
        })

        router.push('/questionnaire')
    }
    const username = watch("username")
    watch("password")
    watch("consent")

    useEffect(() => {
        if (questionnaireData === null || questionnaireData === undefined) {
            return
        }
        questionnaireData.email = username
        setQuestionnaireData(questionnaireData)

    }, [username, questionnaireData, setQuestionnaireData]);


    return (
        <>
            <div className="container flex flex-col h-100 h-full font-ppmori">
                <div className={'flex justify-center items-center mt-[74px]'}>
                    <Logo/>
                </div>
                <div className={'text-[#757575] text-center mt-[24px] text-size-[14px] text-[14px] mb-[40px]'}>
                    Welcome! <br/>Create your account to continue
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3 flex flex-col gap-y-1.5">
                        <Label className={'text-gray-700 font-semibold'} htmlFor={'username'}>Email</Label>
                        <TextInput id={'username'}
                                   placeholder={'contact@whereiskevin.com'}
                                   color={'gray'}
                                   disabled={isLoading}
                                   className={`${errors.username ? 'border-red-900' : ''}`}

                                   {...register("username", {
                                       required: true, pattern: {
                                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                           message: 'Please enter valid email address',
                                       },
                                   })}
                        ></TextInput>
                        {errors.username?.type === 'pattern' &&
                            <div className={'text-xs text-red-900'}>Please enter valid email address</div>}
                        {errors.username?.type === 'required' &&
                            <div className={'text-xs text-red-900'}>Email is required</div>}
                        {errors.username?.type === 'minLength' &&
                            <div className={'text-xs text-red-900'}>Must be at least 8 characters</div>}

                    </div>
                    <div className="mb-[12px] flex flex-col gap-y-[6px]">
                        <Label className={'text-gray-700 font-semibold'} htmlFor={'password'}>Password</Label>
                        <TextInput id={'password'}
                                   placeholder={'************'}
                                   disabled={isLoading}
                                   className={`${errors.password ? 'border-red-900' : ''}`}
                                   type={'password'}
                                   {...register("password", {required: true, minLength: 8})}
                        ></TextInput>
                        {errors.password?.type === 'required' &&
                            <div className={'text-xs text-red-900'}>Password is required</div>}
                        {errors.password?.type === 'minLength' &&
                            <div className={'text-xs text-red-900'}>Must be at least 8 characters</div>}
                    </div>
                    <div className={'flex flex-col text-gray-500 my-6'}>
                        <Label htmlFor={'consent'} className="flex items-center">
                            <div className="flex items-center">
                                <input id={'consent'} aria-describedby={`consent-text`} type="checkbox"
                                       value=""
                                       {...register('consent', {required: true})}
                                       className="hidden"/>
                                <div
                                    className={`w-[16px] h-[16px] checkbox-wrapper border-[1px] ${getValues().consent ? 'border-[#5C3CFA]' : 'border-[#D5D7DA]'}  ${errors.consent ? 'border-red-900' : ''} padding-[2px] rounded-[4px] flex justify-center items-center`}>
                                    {getValues().consent &&
                                        <img alt={''} src={'/images/icons/check.svg'}/>
                                    }
                                </div>
                            </div>
                            <div className={'ms-2 flex flex-col'}>
                                <p className={`text-xs ${errors.consent ? 'text-red-900' : ''}`}>
                                    I've read and agree with the <a
                                    className={'text-xs text-primary-1000 font-semibold'}
                                    href={'/terms-and-conditions'}>Terms and
                                    Conditions</a> and
                                    the <a className={'text-xs text-primary-1000 font-semibold'}
                                           href={'/privacy-policy'}>Privacy
                                    Policy</a>.
                                </p>
                            </div>
                        </Label>
                        {errors.consent?.type === 'required' &&
                            <div className={'text-xs text-red-900 mt-1.5'}>Please accept Terms and Conditions and
                                Privacy Policy</div>}
                    </div>
                    <div className="mb-6 px-6">
                        <Button
                            size={'lg'}
                            type={'submit'}
                            disabled={Object.keys(errors).length > 0}
                            className={'h-10 bg-primary-1000 text-[#F5F5F5] w-full enabled:hover:bg-primary-1000 mt-auto min-h-10 mb-0'}
                            label={'Submit'}>
                            {isLoading ? <Spinner size={'md'}/> :
                                <>
                                    Sign up
                                </>
                            }
                        </Button>
                    </div>
                </form>

                <div className={'text-center text-gray-500 mb-6 text-xs'}>
                    Already have an account? <a className={'text-primary-1000 font-semibold text-xs'} href={'/login'}>Sign
                    in</a>
                </div>

                {/*<hr/>*/}

                {/*<div className={'text-center text-gray-500 mb-[16px] mt-[24px] text-xs'}>*/}
                {/*    Other ways to Sign in*/}
                {/*</div>*/}

            </div>
        </>
    );
}