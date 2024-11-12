import { useCallback } from "react"
import { useEffect, useState } from "react"
import { getEvents, getOwnUsergroups, host } from "../../../modules/data/DBConnect"
import Selector from "../../../modules/components/form/Selector"
import Filter from "../../../modules/components/Filter"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import Button from "../../../modules/components/button/Button"
import Form from "../../../modules/components/form/Form"
import { Table } from "../../../modules/components/overview/Table"
import { Zusage } from "../../dateplanner/overview/Overview"
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
                // TODO: remove check for 'Abgesagt' on 01.01.2025
				return event.Accepted && !(event.Type.includes("Abgesagt") || event.State === EVENT_STATE.CANCELED) && !event.Evaluated && hasPermission(9, event.Association_ID)
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
	const [attendence, setAttendence] = useState(new Array(0))
	const [evaluated, setEvaluated] = useState({})

	const getAttendenceByEvent = useCallback(async () => {
        if(event === undefined)
            return
		fetch(`${host}/api/v0/attendenceeval/${event?.Event_ID}?api_token=${localStorage.getItem('api_token')}`)
		.then(res => res.json())
		.then(data => {
			setAttendence(data)
			let evaluation = {}
			for(let member of data){
				switch(member.Attendence){
				default:
				case -1:	//no response
					evaluation[member.Member_ID] = 0	//unregistered
					break
				case 0:		//denied
					evaluation[member.Member_ID] = 2	//not present
					break
				case 1:		//accepted
					evaluation[member.Member_ID] = 3	//present
					break
				case 2:		//maybe
					evaluation[member.Member_ID] = 2	//not present
					break
				}
			}
			setEvaluated(evaluation)
		})
	}, [event])

	const onClick = useCallback((member_id, attendence) => {
		let evaluation = {...evaluated}
		evaluation[member_id] = attendence
		setEvaluated(evaluation)
	}, [evaluated])

    useEffect(() => {
        getAttendenceByEvent()
    }, [getAttendenceByEvent])

    const cancel = async (e) => {
        e.preventDefault()
        reload()
    }

    const update = async (e) => {
        e.preventDefault()
        fetch(`${host}/api/eval.php?event_id=${event?.Event_ID}&api_token=${localStorage.getItem('api_token')}`, {
            method: 'POST',
            body: JSON.stringify(evaluated)
        })
        .then(response => {
            if(response.status === 200)
                reload()
        })
    }

    return (
        <Form id="evaluation_form">
			{event?.Type} {event?.Location} {event?.Date}
			<Table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Angabe</th>
						<th>Tatsächlich</th>
					</tr>
				</thead>
				<tbody>
					{
						attendence
                        .sort((a, b) => {
                            if(a.Fullname.split(" ")[1] < b.Fullname.split(" ")[1])
                                return -1
                            if(a.Fullname.split(" ")[1] > b.Fullname.split(" ")[1])
                                return 1
                            return 0
                        })
                        .map((attendence) => {
							return(<tr key={`attendence_${attendence.Member_ID}`}>
								<td>{attendence.Fullname}</td>
								<td><Zusage attendence={attendence.Attendence} theme={theme}/></td>
								<td><EvalButton member_id={attendence.Member_ID} attendence={evaluated[attendence.Member_ID]} callback={onClick} theme={theme}/></td>
							</tr>)
						})
					}
				</tbody>
			</Table>
            <Table>
                <tbody>
                    <tr>
                        <td>Unabgemeldet gefehlt</td>
                        <td><EvalButton attendence={0} callback={() => {}} theme={theme}/></td>
                    </tr>
                    <tr>
                        <td>Angemeldet gefehlt</td>
                        <td><EvalButton attendence={1} callback={() => {}} theme={theme}/></td>
                    </tr>
                    <tr>
                        <td>Abgemeldet</td>
                        <td><EvalButton attendence={2} callback={() => {}} theme={theme}/></td>
                    </tr>
                    <tr>
                        <td>Anwesend</td>
                        <td><EvalButton attendence={3} callback={() => {}} theme={theme}/></td>
                    </tr>
                    <tr>
                        <td>Anwesend trotz Abmeldung</td>
                        <td><EvalButton attendence={4} callback={() => {}} theme={theme}/></td>
                    </tr>
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

export default EvaluationInput