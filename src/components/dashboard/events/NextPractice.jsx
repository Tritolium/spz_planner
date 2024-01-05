import { useCallback, useEffect, useState } from "react"
import { getEvalByEvent, updateAttendences } from "../../../modules/data/DBConnect"
import { StyledEvent } from "./Event.styled"
import Event from "./Event"

const NextPractice = ({ nextPractice, auth_level, showEventInfo, theme }) => {

    const [evaluation, setEvaluation] = useState()

    let attendence = nextPractice?.Attendence

    const onClick = async (event_id, att) => {
        const changes = { [event_id]: [att, 0] }
        await updateAttendences(changes, false)
        updateEventEval()
    }

    const updateEventEval = useCallback(async () => {
        getEvalByEvent(nextPractice?.Event_ID, nextPractice?.Usergroup_ID)
            .then(_eval => setEvaluation(_eval))
    }, [nextPractice])

    const clickTD = useCallback(() => {
        showEventInfo(nextPractice)
    }, [showEventInfo, nextPractice])

    useEffect(() => {
        if(nextPractice !== undefined){
            updateEventEval()
        }
    }, [nextPractice, updateEventEval])

    useEffect(() => {
        const interval = setInterval(() => {
            updateEventEval()
        }, 60000);
        return () => clearInterval(interval);
      }, [updateEventEval]);

    return(<>
        <StyledEvent>
            <Event event={nextPractice} attendence={attendence} evaluation={evaluation} auth_level={auth_level} onClick={onClick} clickTD={clickTD} theme={theme}/>
        </StyledEvent>
    </>)
}

export default NextPractice