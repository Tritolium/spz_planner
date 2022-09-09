import { useCallback } from "react"
import { useEffect, useState } from "react"
import Button from "../../../modules/components/button/Button"
import Filter from "../../../modules/components/Filter"
import Form from "../../../modules/components/form/Form"
import FormBox from "../../../modules/components/form/FormBox"
import Selector from "../../../modules/components/form/Selector"
import SelectorItem from "../../../modules/components/form/SelectorItem"
import { getEvents, newEvent, updateEvent } from "../../../modules/data/DBConnect"
import { StyledEventForm } from "./EventForm.styled"

const EventForm = () => {

    const options = [
        {value: "current", label: "Aktuell"},
        {value: "past", label: "Vergangen"},
        {value: "all", label: "Alle"}
    ]

    const [events, setEvents] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)
    const [filter, setFilter] = useState(options[0].value)

    const fetchEvents = useCallback(async () => {
        let _events = await getEvents(filter)
        if(_events !== undefined)
            setEvents(_events)
        else
            setEvents(new Array(0))
    }, [filter])

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
    }, [fetchEvents])

    return (
        <StyledEventForm>
            <EventSelector events={events} onSelect={onSelect} onFilterChange={onFilterChange} options={options}/>
            <DetailForm event={events.find((event) => event.Event_ID === selected)} reload={reload}/>
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

const DetailForm = ({ event, reload }) => {

    useEffect(() => {
        document.getElementById('eventform_form').reset()
    }, [event])

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
        if(event !== undefined)
            await updateEvent(event.Event_ID, type, location, date, begin, departure, leave_dep, accepted)
        else
            await newEvent(type, location, date, begin, departure, leave_dep, accepted)

        reload()
    }

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
                <label htmlFor="accepted">Angenommen:</label>
                <input type="checkbox" name="accepted" id="accepted" defaultChecked={event?.Accepted}/>
            </FormBox>
            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={update}>Speichern</Button>
            </div>
        </Form>
    )
}

export default EventForm