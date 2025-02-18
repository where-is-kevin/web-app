import KevinCheckbox from "@/components/KevinCheckbox";

export function QuestionnaireStepOne() {

    return (
        <>
            <div className={'text-center mb-12'}>
                <h3 className={'font-semibold text-sm mb-1'}>Tell us more about yourself</h3>
                <p className={'font-semibold text-sm text-[#757575] m-0'}>Which of the following best describes you?</p>
            </div>

            <div>
                <div className={'mb-4'}>
                    <KevinCheckbox label={'Business traveler'}
                                   description={'My company sends me places.'}
                                   isSelected={false}
                                   name={'businessTraveler'}
                                   value={'business_traveler'}
                                   id={'businessTraveler'}/>
                </div>
                <div className={'mb-4'}>
                    <KevinCheckbox label={'Solo traveler'}
                                   description={'The world is an open book, waiting for discovery.'}
                                   isSelected={false}
                                   name={'soloTraveler'}
                                   value={'solo_traveler'}
                                   id={'soloTraveler'}/>
                </div>
                <div className={'mb-4'}>
                    <KevinCheckbox label={'Digital nomad'}
                                   description={'Travel is my work and life.'}
                                   isSelected={false}
                                   value={'digital_nomad'}
                                   name={'digitalNomad'}
                                   id={'digitalNomad'}/>
                </div>
                <div className={'mb-4'}>
                    <KevinCheckbox label={'Vacationer'}
                                   description={'I go places to leave my day to day behind.'}
                                   isSelected={false}
                                   name={'vacationer'}
                                   value={'vacationer'}
                                   id={'vacationer'}/>
                </div>

                <div className={'mb-4'}>
                    <KevinCheckbox label={'I don’t really go on trips'}
                                   description={'I prefer to keep my adventures local.'}
                                   isSelected={false}
                                   name={'notTraveler'}
                                   value={'not_traveler'}
                                   id={'notTraveler'}/>
                </div>
            </div>

        </>
    );
}