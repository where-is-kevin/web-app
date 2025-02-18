'use client'

import React, {FC, useEffect, useRef, useState} from "react";
import {Button, Spinner} from "flowbite-react";
import {QuestionnaireStepOne} from "@/components/questionnaire/QuestionnaireStepOne";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import {QuestionnaireStepTwo} from "@/components/questionnaire/QuestionnaireStepTwo";
import {QuestionnaireStepFour} from "@/components/questionnaire/QuestionnaireStepFour";
import {QuestionnaireStepThree} from "@/components/questionnaire/QuestionnaireStepThree";
import {BottomBar} from "@/components/BottomBar";
import useQuestionnaireStore from "@/stores/questionnaire.store";
import {ProgressBar} from "@/components/ProgressBar";
import {useRouter} from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

const Page: FC = function () {
    const router = useRouter()
    const animatedContent = useRef<HTMLDivElement>(null)
    const {
        questionnaireData,
        stepsCompleted,
        progress,
        setProgress,
        currentStep,
        setCurrentStep
    } = useQuestionnaireStore(state => state)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        aboutYou: [],
        likedEvents: [],
        dislikedEvents: [],
    });
    const [isLoading, setLoading] = useState(false)
    const steps = [
        {step: 1, content: () => <><QuestionnaireStepOne/></>},
        {step: 2, content: () => <><QuestionnaireStepTwo/></>},
        {step: 3, content: () => <><QuestionnaireStepThree/></>},
        {step: 4, content: () => <><QuestionnaireStepFour/></>},
    ]

    const nextStep = async () => {
        if (steps[currentStep + 1] === undefined) {
            setLoading(true)

            await axiosInstance.post('/api/v2/user/update', {
                userData: questionnaireData
            })

            router.push('/user/profile')


            return
        }
        setCurrentStep(currentStep + 1)
    }

    const goBack = () => {
        setCurrentStep(currentStep - 1)
    }

    useEffect(() => {
        if (progress === 100) {
            setCurrentStep(3)
        }
    }, [progress, setCurrentStep]);
    return <>
        <div className="flex flex-col min-h-screen font-ppmori">
            <div className={'fixed top-0 pt-3 pb-3 bg-white left-0 w-full container z-[100]'}>
                <header>
                    <div className={'flex items-center justify-center mb-3 pt-3'}>
                        {currentStep > 0 &&
                            <svg onClick={goBack} className="me-auto" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_3943_9612"
                                      style={{maskType: 'alpha'}}
                                      maskUnits="userSpaceOnUse"
                                      x="3"
                                      y="0"
                                      width="10"
                                      height="16">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M12.3654 0.626622C12.7668 1.01713 12.7668 1.65027 12.3654 2.04078L6.24044 8.00011L12.3654 13.9594C12.7668 14.3499 12.7668 14.9831 12.3654 15.3736C11.9641 15.7641 11.3133 15.7641 10.912 15.3736L3.3335 8.00011L10.912 0.626622C11.3133 0.236113 11.9641 0.236113 12.3654 0.626622Z"
                                          fill="#006FFD"/>
                                </mask>
                                <g mask="url(#mask0_3943_9612)">
                                    <rect x="0.000488281" y="-0.000732422" width="15.9994" height="15.9994"
                                          fill="#5C3CFA"/>
                                </g>
                            </svg>
                        }
                        <img className={`${currentStep < 3 ? 'opacity-100' : 'opacity-0'} transition-opacity me-auto`}
                             height={'auto'} width={'40px'} src={'/images/logo-small.png'}
                             alt={'Where is Kevin - logo'}/>
                    </div>

                    <div className={'mb-12 relative'}>
                        <ProgressBar/>
                    </div>
                </header>
            </div>
            {/* Animated Content Transition */}
            <div
                className={`container no-scrollbar ${currentStep === 2 ? 'overflow-y-visible overflow-x-visible ' : 'overflow-y-auto overflow-x-hidden '}  mt-[9rem] mb-[5rem]`}>
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        nodeRef={animatedContent}
                        key={currentStep}
                        timeout={300}
                        classNames="fade"
                        unmountOnExit
                    >
                        <div ref={animatedContent}>{steps[currentStep].content()}</div>
                    </CSSTransition>
                </SwitchTransition>
            </div>

            {(currentStep <= 3 && currentStep !== 2) &&
                <div className={'w-full px-12 fixed left-0 bottom-0 pb-5 bg-white container'}>
                    <Button onClick={nextStep}
                            size={'lg'}
                            disabled={!stepsCompleted[currentStep]}
                            className={'h-10 min-h-10 bg-primary-1000 text-[#F5F5F5] w-full enabled:hover:bg-primary-1000'}>
                        {isLoading ? <Spinner size={'md'}/> :
                            <>
                                {currentStep === 3 ? 'Finish' : 'Next'}
                            </>

                        }
                    </Button>
                </div>

            }
        </div>
    </>
}

export default Page
