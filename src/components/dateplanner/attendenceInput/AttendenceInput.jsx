import { useCallback, useState } from "react";
import { Alert, Blank, Check, Deny, Unregistered } from "./Terminzusage";
import { StyledAttendenceInput } from "./AttendenceInput.styled";
import { ImSpinner10 } from "react-icons/im";
import { EVENT_STATE } from "../../dateadministration/eventform/EventForm";

const ATTENDENCE_NONE = -1
const ATTENDENCE_NO = 0
const ATTENDENCE_YES = 1
const ATTENDENCE_MAYBE = 2

const aboutToStart = {
    "event": 90,
    "practice": 30,
    "other": 60
}

export const AttendenceInput = ({ event, attendence, onClick, theme }) => {
    const [loading, setLoading] = useState(false)
    const [att, setAtt] = useState(attendence)
    const [active, setActive] = useState(false)

    const canceled = event?.State === EVENT_STATE.CANCELED

    const blocked = useCallback((new_att) => {

        if (event?.Date === null)
            return false

        if(event?.Begin === null)
            return false

        if(eventStarted(event)){
            alert("Du kannst deine Zusage nicht mehr ändern, da der Termin bereits begonnen hat. Solltest du vergessen haben abzusagen, schick bitte eine WhatsApp.")
            return true
        }

        if (eventAboutToStart(event)) {
            const alertMessage = "Du kannst deine Zusage nicht mehr ändern, da der Termin in Kürze beginnt. Schick bitte eine WhatsApp zum Abmelden.";
            
            if (att === ATTENDENCE_YES || 
                (active && att === ATTENDENCE_NONE && new_att === ATTENDENCE_NO) || 
                (active && att === ATTENDENCE_MAYBE && new_att === ATTENDENCE_NO)) {
                alert(alertMessage);
                return true;
            }
        }

        return false
    }, [event, att, active])

    const updateAttendence = useCallback(async (new_att) => {

        // if the event is canceled, the attendence can't be changed
        if(canceled)
            return

        // if the event has already started or is about to start, the attendence can't be changed
        if(blocked(new_att))
            return

        // toggle the active state
        setActive(!active)

        // if the input is not active, don't change the attendence
        if(!active)
            return
        
        // if the new attendence is the same as the current one, don't change it
        if(new_att === att)
            return

        setLoading(true)
        await onClick(event?.Event_ID, new_att)
        setLoading(false)
        setAtt(new_att)
    }, [active, event, onClick, att, canceled, blocked])

    const onNoClick = useCallback(async () => {
        updateAttendence(ATTENDENCE_NO)
    }, [updateAttendence])

    const onYesClick = useCallback(async () => {
        updateAttendence(ATTENDENCE_YES)
    }, [updateAttendence])

    const onMaybeClick = useCallback(async () => {
        updateAttendence(ATTENDENCE_MAYBE)
    }, [updateAttendence])

    if(canceled) {
        return (
            <StyledAttendenceInput className="AttendenceInput" active={`${active}`}>
                <Unregistered />
            </StyledAttendenceInput>
        )
    }

    return(
        <StyledAttendenceInput className="AttendenceInput" active={`${active}`}>
            <Button className={`${active ? 'active_no': ''} ${att === ATTENDENCE_NO || active ? 'selected': 'not_selected'}`} attendence={ATTENDENCE_NO} callback={onNoClick} theme={theme}/>
            <Button className={`${active ? 'active_yes': ''} ${att === ATTENDENCE_YES || active ? 'selected': 'not_selected'}`} attendence={ATTENDENCE_YES} callback={onYesClick} theme={theme}/>
            <Button className={`${active ? 'active_maybe': ''} ${att === ATTENDENCE_MAYBE || active ? 'selected': 'not_selected'}`} attendence={ATTENDENCE_MAYBE} callback={onMaybeClick} theme={theme}/>
            <Button className={`${active ? 'active_none': ''} ${att === ATTENDENCE_NONE || active ? 'selected': 'not_selected'}`} attendence={ATTENDENCE_NONE} callback={updateAttendence} theme={theme}/>
            {loading ? <ImSpinner10 className='LoadingSpinner'/> : null}
        </StyledAttendenceInput>
    )
}

const Button = ({ attendence, callback, className, theme }) => {
    switch(attendence){
    default:
    case ATTENDENCE_NONE:
        return(<Blank className={className} callback={callback} theme={theme}/>)
    case ATTENDENCE_NO:
        return(<Deny className={className} callback={callback} theme={theme}/>)
    case ATTENDENCE_YES:
        return(<Check className={className} callback={callback} theme={theme}/>)
    case ATTENDENCE_MAYBE:
        return(<Alert className={className} callback={callback} theme={theme}/>)
    }
}

const eventStarted = (event) => {
    let now = new Date()
    let eventDate = new Date(event?.Date)
    eventDate.setHours(event?.Begin.split(':')[0])
    eventDate.setMinutes(event?.Begin.split(':')[1])
    return now.getTime() > eventDate.getTime()
}

const eventAboutToStart = (event) => {
    let now = new Date()
    let eventDate = new Date(event?.Date)
    eventDate.setHours(event?.Begin.split(':')[0])
    eventDate.setMinutes(event?.Begin.split(':')[1])
    return now.getTime() > eventDate.getTime() - (aboutToStart[event?.Category] * 60000)
}