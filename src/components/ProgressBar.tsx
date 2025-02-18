import useQuestionnaireStore from "@/stores/questionnaire.store";

export const ProgressBar = () => {

    const progress = useQuestionnaireStore(state => state.progress)

    return (
        <>
            <div className={'progress-bar-wrapper bg-[#F5F5F5] h-2 rounded-1 w-full transition'}>
                <div style={{transition: '.5s ease-in-out all', maxWidth: `${progress}%`}}
                     className={`transition progress-bar bg-primary-1000 h-2 rounded-full w-full ${progress ? 'max-w-2' : ''}`}></div>
            </div>
            <div className={'bubble mt-3.5 '}>
                {/*<div className={"triangle"}></div>*/}
                <div className={'transition absolute w-fit'} style={{transition: '.5s ease-in-out all', left: `calc(${progress}% - 15px)`}}>
                <span className={'progress-bar-tooltip text-xs flex items-center justify-center'}>{`${(progress)} %`}</span>
                </div>
            </div>
        </>
    );
};