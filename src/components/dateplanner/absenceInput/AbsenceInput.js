import { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { getEvents, getMembers } from "../../../modules/data/DBConnect"
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
        let event = document.getElementById("event_select").getSelected
        let member = document.getElementById("member_select").getSelected
        alert(event + " " + member)
    }

    return(
        <form className={className}>
            <select id="event_select">
                {events.map(event => {
                    return(<option>{event.Date}: {event.Type} {event.Location}</option>)
                })}
            </select>
            <select id="member_select">
                {members.map(member => {
                    return(<option>{member.Forename} {member.Surname}</option>)
                })}
            </select>
            <Terminzusage attendence={attendence} onClick={onClick}/>{attendence}
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