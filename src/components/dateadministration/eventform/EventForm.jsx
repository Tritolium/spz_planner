import { useCallback } from "react"
import { useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Filter from "../../../modules/components/Filter"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { getDateTemplates, getEvent, getEvents, getUsergroups, newEvent, updateEvent } from "../../../modules/data/DBConnect"
import { StyledEventForm } from "./EventForm.styled"
import { ClothingInput, clothingStyles } from "../../../modules/components/icons/Clothing"

export const EVENT_STATE = {
    PENDING: 0,
    CONFIRMED: 1,
    DECLINED: 2,
    CANCELED: 3
}


const EventForm = () => {

    const date_options = [
        {value: "current", label: "Aktuell"},
        {value: "past", label: "Vergangen"},
        {value: "all", label: "Alle"}
    ]

    const [events, setEvents] = useState(new Array(0))
    const [usergroups, setUsergroups] = useState(new Array(0))
    const [datetemplates, setDatetemplates] = useState(new Array(0))

    const [selected, setSelected] = useState(-1)
    const [filter, setFilter] = useState(date_options[0].value)

    const fetchEvents = useCallback(async () => {
        let _events = await getEvents(filter)
        if(_events !== undefined)
            setEvents(_events)
        else
            setEvents(new Array(0))
    }, [filter])

    const fetchUsergroups = useCallback(async () => {
        let _usergroups = await getUsergroups()
        if(_usergroups !== undefined)
            setUsergroups(_usergroups)
        else
            setUsergroups(new Array(0))
    }, [])

    const fetchDatetemplates = useCallback(async () => {
        let _datetemplates = await getDateTemplates()
        if(_datetemplates !== undefined)
            setDatetemplates(_datetemplates)
        else
            setDatetemplates(new Array(0))
    }, [])

    const reload = useCallback(() => {
        setSelected(-1)
        fetchEvents()
    }, [fetchEvents])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    const onFilterChange = useCallback((e) => {
        setFilter(e.target.value)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEvents()
        }, 5000)
        fetchEvents()
        fetchUsergroups()
        fetchDatetemplates()
        return () => {
            clearInterval(interval)
        }
    }, [fetchEvents, fetchUsergroups, fetchDatetemplates])

    return (
        <StyledEventForm>
            <EventSelector events={events} onSelect={onSelect} onFilterChange={onFilterChange} date_options={date_options} usergroups={usergroups}/>
            <DetailForm usergroups={usergroups} datetemplates={datetemplates} reload={reload} selected={selected}/>
        </StyledEventForm>
    )
}

const EventSelector = ({ events, onSelect, date_options, usergroups, onFilterChange }) => {

    const event_options = [
        {value: "all", label: "Alle"},
        {value: "practice", label: "Probe/Üben"},
        {value: "event", label: "Auftritt"},
        {value: "other", label: "Sonstige Termine"}
    ]

    const usergroup_options = [
        {value: "all", label: "Alle"},
        ...(usergroups.map(usergroup => {
            return {value: usergroup.Usergroup_ID, label: usergroup.Title}
        }))
    ]

    const [eventfilter, setEventfilter] = useState(event_options[0].value)
    const [usergroupfilter, setUsergroupfilter] = useState(usergroup_options[0].value)

    const onEventFilterChange = useCallback((e) => {
        setEventfilter(e.target.value)
    }, [])

    const onUsergroupFilterChange = useCallback((e) => {
        setUsergroupfilter(e.target.value)
    }, [])

    return (
        <Selector>
            <div>
                <Filter options={date_options} onChange={onFilterChange} />
                <Filter options={event_options} onChange={onEventFilterChange} />
                <Filter options={usergroup_options} onChange={onUsergroupFilterChange}/>
            </div>
            {events
            .filter(event => {
                switch(eventfilter) {
                default:
                case 'all':
                    return true
                case 'practice':
                    return event.Category === 'practice'
                case 'event':
                    return event.Category === 'event'
                case 'other':
                    return event.Category === 'other'
                }
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

    let className

    const onClick = useCallback(() => {
        onSelect(event.Event_ID)
    }, [onSelect, event.Event_ID])

    switch(event.State){
    default:
    case EVENT_STATE.PENDING:
        className = "pending"
        break
    case EVENT_STATE.CONFIRMED:
        className = "confirmed"
        break
    case EVENT_STATE.DECLINED:
        className = "declined"
        break
    case EVENT_STATE.CANCELED:
        className = "canceled"
        break
    }

    return (
        <SelectorItem className={className} onClick={onClick}>
            {event.Type} {event.Location}
        </SelectorItem>
    )
}

const DetailForm = ({ usergroups, datetemplates, reload, selected }) => {

    const [event, setEvent] = useState()
    const [clothing, setClothing] = useState()

    useEffect(() => {
        document.getElementById('eventform_form').reset()
        let category_select = document.getElementById('category')
        for(let i = 0; i < category_select.options.length; i++){
            if(category_select.options[i].value === event?.Category)
                category_select.selectedIndex = i
        }
        document.getElementById('state').value = event?.State ?? EVENT_STATE.PENDING
        document.getElementById('usergroup').selectedIndex = usergroups?.findIndex(usergroup => parseInt(usergroup?.Usergroup_ID) === parseInt(event?.Usergroup_ID))
        setClothing(event !== undefined ? event.Clothing : 0)
    }, [event, usergroups])

    useEffect(() => {
        const fetchEvent = async () => {
            let _event = await getEvent(selected)
            if(_event !== undefined)
                setEvent(_event)
        }

        fetchEvent()
    }, [selected])

    const cancel = async (e) => {
        e.preventDefault()
        setEvent(undefined)
        reload()
    }

    const update = async (e) => {
        e.preventDefault()

        let end = null

        let category    = document.getElementById('category').options[document.getElementById('category').selectedIndex].value
        let state       = document.getElementById('state').value
        let type        = document.getElementById('type').value
        let location    = document.getElementById('location').value
        let address     = document.getElementById('address').value
        let date        = document.getElementById('date').value
        let begin       = document.getElementById('begin').value
        let end_date    = document.getElementById('end_date').value
        let end_time    = document.getElementById('end_time').value
        let departure   = document.getElementById('departure').value
        let leave_dep   = document.getElementById('leave_dep').value
        let plusone     = document.getElementById('plusone').checked
        let usergroup   = document.getElementById('usergroup').options[document.getElementById('usergroup').selectedIndex].value
        let fixed       = document.getElementById('fixed').checked
        let push        = document.getElementById('push').checked

        if(end_date !== "" && end_time !== "")
            end = `${end_date} ${end_time}`

        if(event && event.Event_ID !== -1)
            await updateEvent(event.Event_ID, category, state, type, location, address, date, begin, end, departure, leave_dep, plusone, usergroup, clothing, fixed, push)
        else
            await newEvent(category, state, type, location, address, date, begin, end, departure, leave_dep, plusone, usergroup, clothing, fixed, push)

        reload()
    }

    const onTemplateSelect = (template_id) => {
        reload()

        let template = datetemplates?.find(template => template.DateTemplate_ID === template_id)
        
        if(template){
            document.getElementById('category').value   = template.Category
            document.getElementById('type').value       = template.Type
            document.getElementById('location').value   = template.Location
            document.getElementById('begin').value      = template.Begin
            document.getElementById('departure').value  = template.Departure
            document.getElementById('leave_dep').value  = template.Leave_dep
            document.getElementById('usergroup').selectedIndex = usergroups?.findIndex(usergroup => usergroup?.Usergroup_ID === template?.Usergroup_ID)
            document.getElementById('push').checked     = true
            
            if(template.Category === 'practice')
                document.getElementById('state').value = EVENT_STATE.CONFIRMED
        }
    }

    const clothingCallback = useCallback(() => {
        setClothing((clothing + 1) % clothingStyles)
    }, [clothing])

    return (
        <Form id="eventform_form">
            <FormBox>
                <label htmlFor="event_id">ID:</label>
                <input type="text" name="event_id" id="event_id" defaultValue={event?.Event_ID ?? -1} readOnly/>
            </FormBox>
            <FormBox>
                <label htmlFor="category">Art:</label>
                <select name="category" id="category">
                    <option value="event">Auftritt</option>
                    <option value="practice">Üben/Probe</option>
                    <option value="other">Sonstiges</option>
                </select>
            </FormBox>
            <FormBox>
                <label htmlFor="type">Status</label>
                <select name="state" id="state" defaultValue={EVENT_STATE.PENDING}>
                    <option value={EVENT_STATE.PENDING}>Anfrage</option>
                    <option value={EVENT_STATE.CONFIRMED}>Angenommen</option>
                    <option value={EVENT_STATE.DECLINED}>Abgelehnt</option>
                    <option value={EVENT_STATE.CANCELED}>Abgesagt</option>
                </select>
            </FormBox>
            <FormBox>
                <label htmlFor="type">Bezeichnung:</label>
                <input type="text" name="type" id="type" defaultValue={event?.Type}/>
            </FormBox>
            <FormBox>
                <label htmlFor="location">Ort:</label>
                <input type="text" name="location" id="location" defaultValue={event?.Location}/>
            </FormBox>
            <FormBox>
                <label htmlFor="address">Adresse:</label>
                <input type="text" name="address" id="address" defaultValue={event?.Address}/>
            </FormBox>
            <FormBox>
                <label htmlFor="date">Datum:</label>
                <input type="date" name="date" id="date" defaultValue={event?.Date}/>
            </FormBox>
            <FormBox>
                <label htmlFor="begin">Startzeit:</label>
                <input type="time" name="begin" id="begin" step="1" defaultValue={event?.Begin}/>
            </FormBox>
            <FormBox>
                <label htmlFor="end">Ende:</label>
                <input type="date" name="end" id="end_date" defaultValue={event?.End ? event.End.split(" ")[0] : null}/>
                <input type="time" name="end" id="end_time" defaultValue={event?.End ? event.End.split(" ")[1] : null}/>
            </FormBox>
            <FormBox>
                <label htmlFor="departure">Abfahrt:</label>
                <input type="time" name="departure" id="departure" step="1" defaultValue={event?.Departure}/>
            </FormBox>
            <FormBox>
                <label htmlFor="leave_dep">Rückfahrt:</label>
                <input type="time" name="leave_dep" id="leave_dep" step="1" defaultValue={event?.Leave_dep}/>
            </FormBox>
            <FormBox>
                <label htmlFor="clothing">Uniform:</label>
                <ClothingInput id="clothing" clothing={clothing} onClick={clothingCallback}/>
            </FormBox>
            <FormBox>
                <label htmlFor="plusone">mit Begleitung:</label>
                <input type="checkbox" name="plusone" id="plusone" defaultChecked={event?.PlusOne}/>
            </FormBox>
            <FormBox>
                <label htmlFor="fixed">Fixiert:</label>
                <input type="checkbox" name="fixed" id="fixed" defaultChecked={event?.Fixed}/>
            </FormBox>
            <FormBox>
                <label htmlFor="push">Push versenden:</label>
                <input type="checkbox" name="push" id="push" defaultChecked={event?.Push}/>
            </FormBox>
            <FormBox>
                <label htmlFor="usergroup">Sichtbarkeit:</label>
                <select name="usergroup" id="usergroup">
                    {usergroups.map(usergroup => {
                        return(<option key={`usergroup_${usergroup.Usergroup_ID}`} value={usergroup.Usergroup_ID}>{usergroup.Title}</option>)
                    })}
                </select>
            </FormBox>
            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={update}>Speichern</Button>
            </div>
            <DateTemplateSelector datetemplates={datetemplates} onTemplateSelect={onTemplateSelect}/>
        </Form>
    )
}

const DateTemplateSelector = ({ datetemplates, onTemplateSelect }) => {
    return(
        <Selector>
            {datetemplates.map(datetemplate => {
                return(<DateTemplate onSelect={onTemplateSelect} key={datetemplate.Title} datetemplate={datetemplate}/>)
            })}
        </Selector>
    )
}

const DateTemplate = ({ onSelect, datetemplate }) => {

    const onClick = useCallback(() => {
        onSelect(datetemplate.DateTemplate_ID)
    }, [onSelect, datetemplate.DateTemplate_ID])

    return(
        <SelectorItem onClick={onClick}>
            {datetemplate.Title}
        </SelectorItem>
    )
}

export default EventForm