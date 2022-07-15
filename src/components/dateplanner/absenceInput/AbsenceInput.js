import { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { getEvents, getMembers, setAttendence as setSingleAttendence } from "../../../modules/data/DBConnect"
import Terminzusage from "../attendenceInput/Terminzusage"

const AbsenceInput = ({className}) => {

    const [attendence, setAttendence] = useState(-1)
    const [events, setEvents] = useState(new Array(0))
    const [members, setMembers] = useState(new Array(0))

    useEffect(() => {
        const fetchEvents = async () => {
            let _events = await getEvents('current')
            setEvents(_events)
        }
        const fetchMembers = async () => {
            let _members = await getMembers()
            setMembers(_members)
        }
        fetchEvents()
        fetchMembers()
    })

    const onClick = useCallback((_eventId, att) => {
        setAttendence(att)
    }, [])

    const submit = () => {
        let eventS = document.getElementById("event_select")
        let memberS = document.getElementById("member_select")
        let event = eventS.options[eventS.selectedIndex].value
        let member = memberS.options[memberS.selectedIndex].value
        alert(event + " " + member)
        setSingleAttendence(event, member, attendence)
    }

    return(
        <form className={className}>
            <select id="event_select">
                {events.map(event => {
                    return(<option value={event.Event_ID}>{event.Date}: {event.Type} {event.Location}</option>)
                })}
            </select>
            <select id="member_select">
                {members.map(member => {
                    return(<option value={member.Member_ID}>{member.Forename} {member.Surname}</option>)
                })}
            </select>
            <Terminzusage states={3} attendence={attendence} onClick={onClick}/>{attendence}
            <Button type="submit" onClick={submit}>Abschicken</Button>
        </form>
    )
}

const Button = styled.div`
    border-radius: 15px;
    padding: 1px 5px;
    background: #007aff;
    color: white;
    margin: 2px;
`

export default AbsenceInput