'use client'

import React, {ChangeEvent, useContext} from 'react';
import {Label} from "flowbite-react";
import useQuestionnaireStore from "@/stores/questionnaire.store";

interface CheckboxProps {
    label: string;
    description: string;
    isSelected: boolean;
    value: string;
    name: string;
    id: string;
    onChange?: (e: ChangeEvent) => void
}

const KevinCheckbox: React.FC<CheckboxProps> = ({label, description, isSelected, name, id, value, onChange}) => {

    const { questionnaireData, setStepComplete, setProgress } = useQuestionnaireStore(state => state)
    const [isChecked, setChecked] = React.useState(false);

    const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked)

        if (onChange !== undefined) {
            onChange(e)
        }

        if (questionnaireData === undefined || questionnaireData === null) {
            return
        }

        const value = e.target.value;
        const index = questionnaireData.aboutYou.indexOf(value);

        if (index > -1) {
            // If the value is already in the array, remove it
            questionnaireData.aboutYou.splice(index, 1);
        } else {
            // If the value is not in the array, add it
            questionnaireData.aboutYou.push(value);
        }

        setStepComplete(0, questionnaireData.aboutYou.length > 0)
        if (questionnaireData.aboutYou.length > 0) {
            setProgress(25)
        } else {
            setProgress(0)
        }
    }

    return (

        <div className="flex">
            <Label htmlFor={id} className="font-medium text-gray-900 dark:text-gray-300 flex">
                <div className="flex items-center h-5">
                    <input onChange={onCheckboxChange} id={id} aria-describedby={`${id}-text`} type="checkbox"
                           value={value}
                           className="hidden"/>
                    <div
                        className={`w-[16px] h-[16px] checkbox-wrapper border-[1px] ${isChecked ? 'border-[#5C3CFA]' : 'border-[#D5D7DA]'} padding-[2px] rounded-[4px] flex justify-center items-center`}>
                        {isChecked &&
                            <img alt={''} src={'/images/icons/check.svg'}/>
                        }
                    </div>
                </div>
                <div className={'ms-2 flex flex-col'}>
                    <span className={'text-sm font-semibold'}>{label}</span>
                    <p className={'text-gray-600 text-sm'}>{description}</p>
                </div>
            </Label>
        </div>
    );

};


export default KevinCheckbox;