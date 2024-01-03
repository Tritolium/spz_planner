import { useCallback, useEffect, useState } from "react"
import SubmitButton from "../../../modules/components/SubmitButton"
import { getEvents, getMembers, setAttendence as setSingleAttendence } from "../../../modules/data/DBConnect"
import Terminzusage from "../attendenceInput/Terminzusage"
import { StyledAbsenceInput } from "./AbsenceInput.styled"

const AbsenceInput = ({ theme }) => {

    const [attendence, setAttendence] = useState(-1)
    const [usergroups, setUsergroups] = useState(new Array(0))
    const [events, setEvents] = useState(new Array(0))
    const [members, setMembers] = useState(new Array(0))

    const [selectedUsergroupFilter, setSelectedUsergroupFilter] = useState(-1)

    useEffect(() => {
        const fetchEvents = async () => {
            let _events = await getEvents('current')
            setEvents(_events)
        }
        const fetchMembers = async () => {
            let _members = await getMembers()
            setMembers(_members)
            setUsergroups(_members[0].Usergroups)
        }
        fetchEvents()
        fetchMembers()
    }, [])

    const onClick = useCallback((_eventId, att) => {
        setAttendence(att)
    }, [])

    const onUsergroupFilterChange = useCallback(e => {
        if (e.target.value === 'all')
            setSelectedUsergroupFilter(-1)
        else
            setSelectedUsergroupFilter(parseInt(e.target.value))

    }, [setSelectedUsergroupFilter])

    const submit = () => {
        let eventS = document.getElementById("event_select")
        let memberS = document.getElementById("member_select")
        let event = eventS.options[eventS.selectedIndex].value
        let member = memberS.options[memberS.selectedIndex].value
        setSingleAttendence(event, member, attendence)
    }

    return(
        <StyledAbsenceInput>
            <select id="usergroup_select" onChange={onUsergroupFilterChange}>
                <option key={"usergroup_all"} value="all">Alle</option>
                {usergroups.map(usergroup => {
                    return(<option key={`usergroup_${usergroup.Usergroup_ID}`} value={usergroup.Usergroup_ID}>{usergroup.Title}</option>)
                })}
            </select>
            <select id="event_select">
                {events.filter(event => {
                    if(selectedUsergroupFilter === -1)
                        return true
                    return event.Usergroup_ID === selectedUsergroupFilter
                }).map(event => {
                    return(<option key={`event_${event.Event_ID}`} value={event.Event_ID}>{event.Date}: {event.Type} {event.Location}</option>)
                })}
            </select>
            <select id="member_select">
                {members.filter(member => {
                    if (selectedUsergroupFilter === -1)
                        return true
                    for(let usergroup of member.Usergroups){
                        if (parseInt(usergroup.Usergroup_ID) === selectedUsergroupFilter){
                            return usergroup.Assigned
                        }
                    }

                    return false
                }).map(member => {
                    return(<option key={`member_${member.Member_ID}`} value={member.Member_ID}>{member.Forename} {member.Surname}</option>)
                })}
            </select>
            <Terminzusage states={3} attendence={attendence} onClick={onClick} theme={theme}/>
            <SubmitButton type="submit" onClick={submit}>Abschicken</SubmitButton>
        </StyledAbsenceInput>
    )
}

export default AbsenceInput