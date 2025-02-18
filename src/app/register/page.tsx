'use client'

import {FC, useEffect} from "react";
import Register from "@/components/form/Register";
import useEventStore from "@/stores/event.store";
import useQuestionnaireStore from "@/stores/questionnaire.store";

const RegisterPage: FC = function () {

    const eventStore = useEventStore()
    const questionnaireStore = useQuestionnaireStore()
    useEffect(() => {
        eventStore.reset()
        questionnaireStore.reset()
    }, [])

    return <>
        <Register/>
    </>
};

export default RegisterPage;
