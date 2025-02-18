'use client'

import React, {useCallback, useEffect, useState} from "react";
import {Label, TextInput} from "flowbite-react";
import {useForm} from "react-hook-form";
import PicturePicker from "@/components/form/PicturePicker";
import useQuestionnaireStore from "@/stores/questionnaire.store";

export function QuestionnaireStepTwo() {
    const {
        register,
        watch,
        formState: {errors},
        handleSubmit,
        getValues
    } = useForm();
    const [isLoading, setIsLoading] = useState(false)

    const { questionnaireData, setQuestionnaireData } = useQuestionnaireStore(state => state)

    const onSubmit = () => {}

    const firstName = watch('firstName')
    const lastName = watch('lastName')
    const home = watch('home')
    const travelDestination = watch('travelDestination')

    const { setProgress, setStepComplete } = useQuestionnaireStore(state => state)

    const updateProgress = useCallback(() => {

        const values = getValues()

        if (values.firstName === '' || values.lastName === '' || values.home === '' || values.travelDestination === '') {
            setProgress(25)
            setStepComplete(1, false)
            return
        }

        setProgress(50)
        setStepComplete(1, true)

    }, [getValues, setProgress, setStepComplete])

    useEffect(() => {
        if (questionnaireData !== undefined) {
            questionnaireData.home = home
            questionnaireData.firstName = firstName
            questionnaireData.lastName = lastName
            questionnaireData.travelDestination = travelDestination
            setQuestionnaireData(questionnaireData)
        }

        updateProgress()

    }, [travelDestination, firstName, lastName, home, updateProgress, questionnaireData, setQuestionnaireData]);


    return (
        <>
            <div className={'text-center mb-6'}>
                <h3 className={'font-semibold text-xs mb-1'}> Finalise setting up your profile</h3>
                <p className={'font-semibold text-xs text-[#757575] m-0'}>
                    You will be able to change this info later
                </p>
            </div>

            <section className="flex flex-col flex-1items-center  mt-10 w-full">
                <form className={'w-full'} onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-5 flex flex-col gap-y-1.5 w-full">
                        <PicturePicker/>
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
                </form>
            </section>
        </>
    )
}
