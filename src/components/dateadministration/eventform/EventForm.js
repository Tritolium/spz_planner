import { useCallback } from "react"
import { useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Filter from "../../../modules/components/Filter"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { getDateTemplates, getEvents, getUsergroups, newEvent, updateEvent } from "../../../modules/data/DBConnect"
import { StyledEventForm } from "./EventForm.styled"

import blank from '../../../icons/blank_old.png'
import polo from '../../../icons/polo.png'
import polod from '../../../icons/polod.png'
import shirt from '../../../icons/shirt.png'
import suit from '../../../icons/suit.png'
import cow from '../../../icons/cow.png'

const EventForm = () => {

    const options = [
        {value: "current", label: "Aktuell"},
        {value: "past", label: "Vergangen"},
        {value: "all", label: "Alle"}
    ]

    const [events, setEvents] = useState(new Array(0))
    const [usergroups, setUsergroups] = useState(new Array(0))
    const [datetemplates, setDatetemplates] = useState(new Array(0))

    const [selected, setSelected] = useState(-1)
    const [filter, setFilter] = useState(options[0].value)

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
        fetchEvents()
        fetchUsergroups()
        fetchDatetemplates()
    }, [fetchEvents, fetchUsergroups, fetchDatetemplates])

    return (
        <StyledEventForm>
            <EventSelector events={events} onSelect={onSelect} onFilterChange={onFilterChange} options={options}/>
            <DetailForm event={events.find((event) => event.Event_ID === selected)} usergroups={usergroups} datetemplates={datetemplates} reload={reload}/>
        </StyledEventForm>
    )
}

const EventSelector = ({ events, onSelect, options, onFilterChange }) => {
    return (
        <Selector>
            <Filter options={options} onChange={onFilterChange} />
            {events.map(event => {
                return(
                    <EventItem event={event} onSelect={onSelect}/>
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

const DetailForm = ({ event, usergroups, datetemplates, reload }) => {

    const [clothing, setClothing] = useState()

    useEffect(() => {
        document.getElementById('eventform_form').reset()
        document.getElementById('usergroup').selectedIndex = usergroups?.findIndex(usergroup => parseInt(usergroup?.Usergroup_ID) === parseInt(event?.Usergroup_ID))
        setClothing(event !== undefined ? event.Clothing : 0)
    }, [event, usergroups])

    const cancel = async (e) => {
        e.preventDefault()
        reload()
    }

    const update = async (e) => {
        e.preventDefault()

        let type        = document.getElementById('type').value
        let location    = document.getElementById('location').value
        let date        = document.getElementById('date').value
        let begin       = document.getElementById('begin').value
        let departure   = document.getElementById('departure').value
        let leave_dep   = document.getElementById('leave_dep').value
        let accepted    = document.getElementById('accepted').checked
        let usergroup   = document.getElementById('usergroup').options[document.getElementById('usergroup').selectedIndex].value

        if(event !== undefined)
            await updateEvent(event.Event_ID, type, location, date, begin, departure, leave_dep, accepted, usergroup, clothing)
        else
            await newEvent(type, location, date, begin, departure, leave_dep, accepted, usergroup, clothing)

        reload()
    }

    const onTemplateSelect = (template_id) => {
        reload()

        let template = datetemplates?.find(template => template.DateTemplate_ID === template_id)
        
        document.getElementById('type').value       = template.Type
        document.getElementById('location').value   = template.Location
        document.getElementById('begin').value      = template.Begin
        document.getElementById('departure').value  = template.Departure
        document.getElementById('leave_dep').value  = template.Leave_dep
        document.getElementById('accepted').checked = true
        document.getElementById('usergroup').selectedIndex = usergroups?.findIndex(usergroup => usergroup?.Usergroup_ID === template?.Usergroup_ID)
    }

    const clothingCallback = useCallback(() => {
        setClothing((clothing + 1) % 6)
    }, [clothing])

    return (
        <Form id="eventform_form">
            <FormBox>
                <label htmlFor="type">Art:</label>
                <input type="text" name="type" id="type" defaultValue={event?.Type}/>
            </FormBox>
            <FormBox>
                <label htmlFor="location">Ort:</label>
                <input type="text" name="location" id="location" defaultValue={event?.Location}/>
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
                <label htmlFor="departure">Abfahrt:</label>
                <input type="time" name="departure" id="departure" step="1" defaultValue={event?.Departure}/>
            </FormBox>
            <FormBox>
                <label htmlFor="leave_dep">Rückfahrt:</label>
                <input type="time" name="leave_dep" id="leave_dep" step="1" defaultValue={event?.Leave_dep}/>
            </FormBox>
            <FormBox>
                <label htmlFor="clothing">Uniform:</label>
                <ClothingInput id="clothing" value={clothing} clothingCallback={clothingCallback}/>
            </FormBox>
            <FormBox>
                <label htmlFor="accepted">Angenommen:</label>
                <input type="checkbox" name="accepted" id="accepted" defaultChecked={event?.Accepted}/>
            </FormBox>
            <FormBox>
                <label htmlFor="usergroup">Sichtbarkeit:</label>
                <select name="usergroup" id="usergroup">
                    {usergroups.map(usergroup => {
                        return(<option value={usergroup.Usergroup_ID}>{usergroup.Title}</option>)
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

const ClothingInput = ({ value, clothingCallback}) => {
    switch(value){
    default:
    case 0:
        return(<img src={blank} alt='n.A.' onClick={clothingCallback}/>)
    case 1:
        return(<img src={polo} alt='PoloR' onClick={clothingCallback}/>)
    case 2:
        return(<img src={polod} alt='PoloD' onClick={clothingCallback}/>)
    case 3:
        return(<img src={shirt} alt='Hemd' onClick={clothingCallback}/>)
    case 4:
        return(<img src={suit} alt='Jacke' onClick={clothingCallback}/>)
    case 5:
        return(<img src={cow} alt='Kuh' onClick={clothingCallback}/>)
    }
}

export default EventForm