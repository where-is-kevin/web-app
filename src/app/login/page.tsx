'use client'

import Login from "@/components/form/Login";
import useEventStore from "@/stores/event.store";
import useQuestionnaireStore from "@/stores/questionnaire.store";
import {useEffect} from "react";

export default function Page() {

    const eventStore = useEventStore()
    const questionnaireStore = useQuestionnaireStore()
    useEffect(() => {
        eventStore.reset()
        questionnaireStore.reset()
    }, [])

    return <><Login /></>
}
