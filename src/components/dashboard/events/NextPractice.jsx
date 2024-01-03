import { useCallback, useEffect, useState } from "react"
import { getEvalByEvent, updateAttendences } from "../../../modules/data/DBConnect"
import Terminzusage from "../../dateplanner/attendenceInput/Terminzusage"
import { DashboardDiagram } from "./Event"

const NextPractice = ({ nextPractice, auth_level, showEventInfo, theme }) => {

    const [evaluation, setEvaluation] = useState()

    let practiceDate = new Date(nextPractice?.Date)
    let attendence = nextPractice?.Attendence

    const onClick = async (event_id, att) => {
        let changes = {}
        changes['' + event_id] = [att, false]
        await updateAttendences(changes, false)
        updateEventEval()
    }

    const updateEventEval = useCallback(async () => {
        let _eval = await getEvalByEvent(nextPractice?.Event_ID, nextPractice?.Usergroup_ID)
        setEvaluation(_eval)
        return
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
        <tr className='event_header'>
            <td onClick={clickTD}>{nextPractice?.Type}</td>
            <td onClick={clickTD}>{nextPractice?.Location}</td>
            <td rowSpan={2}><Terminzusage event={nextPractice} event_id={nextPractice?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={nextPractice?.Type.includes('Abgesagt')} theme={theme}/></td>
        </tr>
        <tr>
            <td onClick={clickTD}>{practiceDate.getDate()}.{practiceDate.getMonth() + 1}.{practiceDate.getFullYear()}</td>
            <td onClick={clickTD}>{nextPractice?.Begin === null ? '-' : `${nextPractice?.Begin.slice(0, 5)} Uhr`}</td>
        </tr>
        <tr>
            {auth_level > 1 ? <td colSpan={3}><DashboardDiagram event={evaluation} auth_level={auth_level} theme={theme}/></td> : <></>}
        </tr>
    </>)
}

export default NextPractice