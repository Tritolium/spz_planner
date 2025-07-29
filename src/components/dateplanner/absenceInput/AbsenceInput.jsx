import { useCallback, useEffect, useState } from "react"
import SubmitButton from "../../../modules/components/SubmitButton"
import { getEvents, getOwnUsergroups, host, setAttendence as setSingleAttendence } from "../../../modules/data/DBConnect"
import Terminzusage from "../attendenceInput/Terminzusage"
import { StyledAbsenceInput } from "./AbsenceInput.styled"
import PlusOne from "../../../modules/components/icons/PlusOne"
import OwnArrival from "../../../modules/components/icons/OwnArrival"
import { hasPermission } from "../../../modules/helper/Permissions"

const AbsenceInput = ({ theme }) => {

    const [attendence, setAttendence] = useState(-1)
    const [plusone, setPlusone] = useState(false)
    const [ownArrival, setOwnArrival] = useState(false)

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
            fetch(`${host}/api/v0/member?api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setMembers(data)
            }, () => {
                setMembers(new Array(0))
            })
        }

        const fetchUsergroups = async () => {
            let _usergroups = await getOwnUsergroups()
            _usergroups = _usergroups.filter(usergroup => {
                return hasPermission(6, usergroup.Association_ID)
            })
            setUsergroups(_usergroups)
            setSelectedUsergroupFilter(_usergroups[0].Usergroup_ID)
        }
        fetchEvents()
        fetchMembers()
        fetchUsergroups()
    }, [])

    const onClick = useCallback((_eventId, att) => {
        setAttendence(att)
    }, [])

    const togglePlusone = () => {
        setPlusone(!plusone)
    }
    const toggleOwnArrival = () => {
        setOwnArrival(!ownArrival)
    }
    const onUsergroupFilterChange = useCallback(e => {
        setSelectedUsergroupFilter(parseInt(e.target.value))
    }, [setSelectedUsergroupFilter])

    const submit = () => {
        let eventS = document.getElementById("event_select")
        let memberS = document.getElementById("member_select")
        let event = eventS.options[eventS.selectedIndex].value
        let member = memberS.options[memberS.selectedIndex].value
        setSingleAttendence(event, member, attendence, plusone, ownArrival)
    }

    return(
        <StyledAbsenceInput>
            <select id="usergroup_select" onChange={onUsergroupFilterChange}>
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
                    console.log("member", member)
                    if (selectedUsergroupFilter === -1)
                        return true
                    for(let usergroup_id of member.Usergroups){
                        if(parseInt(usergroup_id) === selectedUsergroupFilter)
                            return true
                    }
                    return false
                }).map(member => {
                    return(<option key={`member_${member.Member_ID}`} value={member.Member_ID}>{member.Forename} {member.Surname}</option>)
                })}
            </select>
            <Terminzusage states={3} attendence={attendence} onClick={onClick} theme={theme}/>
            <PlusOne plusOne={plusone} onClick={togglePlusone} active={attendence === 1} theme={theme}/>
            <OwnArrival ownArrival={ownArrival} onClick={toggleOwnArrival} active={attendence === 1} theme={theme}/>
            <SubmitButton type="submit" onClick={submit}>Abschicken</SubmitButton>
        </StyledAbsenceInput>
    )
}

export default AbsenceInput