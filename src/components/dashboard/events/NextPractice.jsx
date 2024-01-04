import { useCallback, useEffect, useState } from "react"
import { getEvalByEvent, updateAttendences } from "../../../modules/data/DBConnect"
import Terminzusage from "../../dateplanner/attendenceInput/Terminzusage"
import { DashboardDiagram } from "./Event"
import { StyledEvent } from "./Event.styled"

const NextPractice = ({ nextPractice, auth_level, showEventInfo, theme }) => {

    const [evaluation, setEvaluation] = useState()

    let practiceDate = new Date(nextPractice?.Date)
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
            <div className="event_type" onClick={clickTD}>{nextPractice?.Type}</div>
            <div className="event_location" onClick={clickTD}>{nextPractice?.Location}</div>
            <Terminzusage className="event_attendence" event={nextPractice} event_id={nextPractice?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={nextPractice?.Type.includes('Abgesagt')} theme={theme}/>
            <div className="event_date" onClick={clickTD}>{practiceDate.getDate()}.{practiceDate.getMonth() + 1}.{practiceDate.getFullYear()}</div>
            <div className="event_begin" onClick={clickTD}>{nextPractice?.Begin === null ? '-' : `${nextPractice?.Begin.slice(0, 5)} Uhr`}</div>
            {auth_level > 1 ? <div className="event_diagram"><DashboardDiagram className={"event_diagram"} event={evaluation} auth_level={auth_level} theme={theme}/></div> : <></>}
        </StyledEvent>
    </>)
}

export default NextPractice