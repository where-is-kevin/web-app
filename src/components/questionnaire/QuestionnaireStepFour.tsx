import Image from "next/image";

export function QuestionnaireStepFour() {

    return (
        <>
            <div className={'text-center mb-16'}>
                <h3 className={'font-semibold text-xs mb-1'}>You are all set!</h3>
                <p className={'font-semibold text-xs text-[#757575] m-0'}>You can now start exploring</p>
            </div>

            <div className={'m-auto flex justify-center items-center'}>
                <Image quality={100} src={'/images/whereiskevin-animated.gif'} alt={'Where is Kevin - logo'} width={200} height={200}  />
            </div>

        </>
    );
}