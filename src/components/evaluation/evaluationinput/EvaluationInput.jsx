import { useCallback } from "react"
import { useEffect, useState } from "react"
import { getEvents, getOwnUsergroups, host } from "../../../modules/data/DBConnect"
import Selector from "../../../modules/components/form/Selector"
import Filter from "../../../modules/components/Filter"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import { Table } from "../../../modules/components/overview/Table"
import { StyledEvaluationInput } from "./EvaluationInput.styled"
import { Check, DeniedCheck, Deny, Noshow, Unregistered } from "../../dateplanner/attendenceInput/Terminzusage"
import { hasPermission } from "../../../modules/helper/Permissions"
import { EVENT_STATE } from "../../dateadministration/eventform/EventForm"

const EvaluationInput = ({ theme }) => {
    const [events, setEvents] = useState(new Array(0))
    const [usergroups, setUsergroups] = useState(new Array(0))

    const [selected, setSelected] = useState(-1)

    const fetchEvents = useCallback(async () => {
        let _events = await getEvents("all")
        if(_events !== undefined)
            setEvents(_events)
        else
            setEvents(new Array(0))
    }, [])

    const fetchUsergroups = useCallback(async () => {
        let _usergroups = await getOwnUsergroups()
        if(_usergroups !== undefined) {
            _usergroups = _usergroups.filter(usergroup => hasPermission(9, usergroup.Association_ID))
            setUsergroups(_usergroups)
        } else
            setUsergroups(new Array(0))
    }, [])

    const reload = useCallback(() => {
        setSelected(-1)
        fetchEvents()
    }, [fetchEvents])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    useEffect(() => {
        fetchEvents()
        fetchUsergroups()
    }, [fetchEvents, fetchUsergroups])

    return (
        <StyledEvaluationInput>
            <EventSelector events={events} onSelect={onSelect} usergroups={usergroups}/>
            <DetailForm event={events.find((event) => event.Event_ID === selected)} reload={reload} theme={theme}/>
        </StyledEvaluationInput>
    )
}

const EventSelector = ({ events, onSelect, usergroups }) => {

    const usergroup_options = [
        {value: "all", label: "Alle"},
        ...(usergroups.map(usergroup => {
            return {value: usergroup.Usergroup_ID, label: usergroup.Title}
        }))
    ]

    const [usergroupfilter, setUsergroupfilter] = useState(usergroup_options[0].value)

    const onUsergroupFilterChange = useCallback((e) => {
        setUsergroupfilter(e.target.value)
    }, [])

    return (
        <Selector>
            <div>
                <Filter options={usergroup_options} onChange={onUsergroupFilterChange}/>
            </div>
            {events
            .filter(event => {
				return event.State === EVENT_STATE.CONFIRMED && !event.Evaluated && hasPermission(9, event.Association_ID)
            })
			.filter(event => {
				let now = new Date()
				let eventDate = new Date(event.Date)
                if (event.Begin !== null) {
                    eventDate.setHours(event?.Begin.split(':')[0], event?.Begin.split(':')[1], 0, 0)
                }
				return eventDate < now
			})
            .filter(event => {
                if(usergroupfilter === "all")
                    return true
                
                return  parseInt(event.Usergroup_ID) === parseInt(usergroupfilter)
            })
            .map(event => {
                return(
                    <EventItem key={`event_${event.Event_ID}`} event={event} onSelect={onSelect}/>
                )
            })}
        </Selector>
    )
}

const EventItem = ({ event, onSelect }) => {

    const onClick = useCallback(() => {
        onSelect(event.Event_ID)
    }, [onSelect, event.Event_ID])

    return (
        <SelectorItem onClick={onClick}>
            {event.Type} {event.Location}
        </SelectorItem>
    )
}

const DetailForm = ({ event, reload, theme }) => {
    const [userResponse, setUserResponse] = useState(new Array(0))
    const [predicted, setPredicted] = useState(new Array(0))

    const fetchUserResponse = useCallback(async () => {
        if(event === undefined)
            return
        fetch(`${host}/api/v0/attendenceeval/${event?.Event_ID}?api_token=${localStorage.getItem('api_token')}`)
        .then(res => res.json())
        .then(data => {
            setUserResponse(data)

            let prediction = {}

            for(let member of data){
                if (member.Attendence === -1) {
                    switch(member.Prediction){
                    default:
                    case 0: // prob attending
                        prediction[member.Member_ID] = 1
                        break
                    case 1: // prob not attending
                    case 2: // prob declined
                        prediction[member.Member_ID] = 0
                        break
                    }
                } else {
                    switch(member.Attendence){
                    default:
                    case 0: // declined
                    case 2: // maybe
                        prediction[member.Member_ID] = 0
                        break
                    case 1: // accepted
                    case 3: // delayed
                        prediction[member.Member_ID] = 1
                        break
                    }
                }
            }
            
            setPredicted(prediction)
        })
    }, [event])

    const onClick = useCallback((member_id, attendence) => {
        let prediction = {...predicted}

        prediction[member_id] = attendence
        setPredicted(prediction)
    }, [predicted])

    const update = async (e) => {
        e.preventDefault()

        let evaluation = {}
        let member_id, prediction

        for(let member of userResponse){
            member_id = member.Member_ID
            prediction = predicted[member_id]
            switch(member.Attendence){
            default:
            case -1:                            //no response
                if(prediction === 0)            //absent
                    evaluation[member_id] = 0   //absent without notice
                else
                    evaluation[member_id] = 3   //attending
                break
            case 0:                             //declined
                if(prediction === 0)            //absent
                    evaluation[member_id] = 2   //absent with notice
                else
                    evaluation[member_id] = 4   //attending despite notice
                break
            case 1:                             //accepted
                if(prediction === 0)            //absent
                    evaluation[member_id] = 1   //absent despite acceptance
                else
                    evaluation[member_id] = 3   //attending
                break
            case 2:                             //maybe
                if(prediction === 0)            //absent
                    evaluation[member_id] = 2   //absent with notice
                else
                    evaluation[member_id] = 3   //attending
                break
            case 3:                             //delayed
                if(prediction === 0)            //absent
                    evaluation[member_id] = 1   //absent despite acceptance
                else
                    evaluation[member_id] = 3   //attending
                break
            }
        }

        fetch(`${host}/api/eval.php?event_id=${event?.Event_ID}&api_token=${localStorage.getItem('api_token')}`, {
            method: 'POST',
            body: JSON.stringify(evaluation)
        })
        .then(response => {
            if(response.status === 200)
                reload()
        })
    }

    const cancel = async (e) => {
        e.preventDefault()
        reload()
    }


    useEffect(() => {
        fetchUserResponse()
    }, [fetchUserResponse])

    return (
        <Form id="evaluation_form">
            {event?.Type} {event?.Location} {event?.Date}
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Anwesenheit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userResponse
                        .sort((a, b) => {
                            if(a.Fullname.split(" ")[1] < b.Fullname.split(" ")[1])
                                return -1
                            if(a.Fullname.split(" ")[1] > b.Fullname.split(" ")[1])
                                return 1
                            return 0
                        })
                        .map((attendence) => {
                            return(
                                <tr key={`attendence_${attendence.Member_ID}`}>
                                    <td>{attendence.Fullname}</td>
                                    <td><EvalButtonNew member_id={attendence.Member_ID} attendence={predicted[attendence.Member_ID]} callback={onClick} theme={theme}/></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={update}>Speichern</Button>
            </div>
        </Form>
    )
}

export const EvalButton = ({ member_id, attendence, callback, theme }) => {

	const onClick = useCallback(() => {
		callback(member_id, (attendence + 1) % 5)
	}, [callback, member_id, attendence])

    switch(attendence){
    default:
    case 0:
        return(<Unregistered callback={onClick}/>)
	case 1:
		return(<Noshow callback={onClick}/>)
	case 2:
		return(<Deny callback={onClick} theme={theme}/>)
    case 3:
        return(<Check callback={onClick} theme={theme}/>)
    case 4:
        return(<DeniedCheck callback={onClick}/>)
    }
}

const EvalButtonNew = ({ member_id, attendence, callback, theme }) => {

    const onClick = useCallback(() => {
        callback(member_id, (attendence + 1) % 2)
    }, [callback, member_id, attendence])

    switch(attendence){
    default:
    case 0:
        return(<Deny callback={onClick} theme={theme}/>)
    case 1:
        return(<Check callback={onClick} theme={theme}/>)
    }
}

export default EvaluationInput