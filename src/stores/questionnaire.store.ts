import {create} from "zustand";
import { devtools, persist } from 'zustand/middleware'

interface QuestionnaireData {
    name: '',
    email: '',
    firstName: '',
    lastName: '',
    aboutYou: string[],
    likedEvents: string[],
    dislikedEvents: string[],
    home: '',
    travelDestination: '',
}
interface QuestionnaireState {
    stepsCompleted: boolean[],
    setStepComplete: (index: number, complete: boolean) => void,
    progress: number
    currentStep: number
    setCurrentStep: (step: number) => void
    setProgress: (progress: number) => void
    questionnaireData?: QuestionnaireData
    setQuestionnaireData: (questionnaireData: QuestionnaireData) => void
    reset: () => void
}

const useQuestionnaireStore = create<QuestionnaireState>()(
    devtools(
        persist(
            (set) => ({
                currentStep: 0,
                reset: () => {
                    set((state: QuestionnaireState) => ({
                        currentStep: 0,
                        questionnaireData: {
                            name: '',
                            email: '',
                            aboutYou: [],
                            likedEvents: [],
                            dislikedEvents: [],
                            home: '',
                            travelDestination: '',
                            firstName: '',
                            lastName: '',
                        },
                        stepsCompleted: [false, false, false, true],
                        progress: 0,
                    }))
                },
                setCurrentStep: (step: number) => {
                    set((state: QuestionnaireState) => ({
                        currentStep: step,
                    }))
                },
                questionnaireData: {
                    name: '',
                    email: '',
                    aboutYou: [],
                    likedEvents: [],
                    dislikedEvents: [],
                    home: '',
                    travelDestination: '',
                    firstName: '',
                    lastName: '',
                },
                setQuestionnaireData: (questionnaireData: QuestionnaireData) => {
                  set((state: QuestionnaireState) => ({
                        questionnaireData: questionnaireData,
                    }))
                },
                stepsCompleted: [false, false, false, true],
                setStepComplete: (index: number, complete: boolean) => {
                    set((state: QuestionnaireState) =>( {
                            stepsCompleted: state.stepsCompleted.map((completed, i) =>
                            i === index ? complete : completed
                        ),
                    }));
                },
                progress: 0,
                setProgress: (progress: number) => {
                    set((state: QuestionnaireState) =>( {
                        progress: progress
                    }));
                },
            }),
            {
                name: 'questionnaire-storage'
            }
        )
    )
)

export default useQuestionnaireStore