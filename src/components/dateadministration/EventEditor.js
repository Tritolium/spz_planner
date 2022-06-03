import { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import Filter from "../../modules/components/Filter"
import { getEvent, getEvents, newEvent, updateEvent } from "../../modules/data/DBConnect"
import { formtheme } from "../Themes"

const EventEditor = (props) => {

    const options = [
        {value: "current", label: "Aktuell"},
        {value: "past", label: "Vergangen"},
        {value: "all", label: "Alle"}
    ]
    
    const [events, setEvents] = useState(new Array(0))
    const [selected, setSelected] = useState(-1)
    const [filter, setFilter] = useState(options[0].value)

    const fetchEvents = useCallback(async () => {
        let _Events = await getEvents(filter)
        setEvents(_Events)
    }, [filter])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const onSelect = useCallback((id) => {
        setSelected(id)
    }, [])

    const reload = useCallback(() => {
        fetchEvents()
    }, [fetchEvents])

    const onFilterChange = useCallback((e) => {
        setFilter(e.target.value)
    }, [])

    return(
        <div className={props.className}>
            <SEventSelector onSelect={onSelect} onFilterChange={onFilterChange} options={options} events={events}/>
            <SEditor selected={selected} reload={reload}/>
        </div>
    )
}

const EventSelector = (props) => {

    const onSelect = useCallback((id) => {
        props.onSelect(id)
    }, [props])

    return(
        <div className={props.className}>
            <Filter options={props.options} onChange={props.onFilterChange} />
            {props.events.map(event => {
                return(<SEvent onSelect={onSelect} key={event.Event_ID} event={event}/>)
            })}
        </div>
    )
}

const SEventSelector = styled(EventSelector)`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    max-height: 100%;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-y: scroll;
    white-space: nowrap;
    overflow-x: none;
    width: auto;
    min-width: fit-content;
`

const Editor = (props) => {

    const [event, setEvent] = useState({
        Event_ID: -1,
        Type: "",
        Location: "",
        Date: "01-01-1901",
        Begin: "12:12",
        Departure: "12:12",
        Leave_dep: "12:12"
    })

    useEffect(() => {
        const fetchEvent = async () => {
            let _event = await getEvent(props.selected)
            if(_event !== undefined)
                setEvent(_event)
        }
        fetchEvent()
    }, [props.selected])

    useEffect(() => {
        document.getElementById("eventeditor").reset()
    }, [event])

    const onSubmit = async(e) => {
        e.preventDefault()
        let _event = {
            Event_ID: event.Event_ID,
            Type: document.getElementById("type").value,
            Location: document.getElementById("location").value,
            Date: document.getElementById("date").value,
            Begin: document.getElementById("begin").value,
            Departure: document.getElementById("departure").value,
            Leave_dep: document.getElementById("leave_dep").value
        }

        if(_event.Event_ID > 0){
            await updateEvent(_event)
        }

        props.reload()
    }

    const createNew = async(e) => {
        e.preventDefault()
        let _event = {
            Type: document.getElementById("type").value,
            Location: document.getElementById("location").value,
            Date: document.getElementById("date").value,
            Begin: document.getElementById("begin").value,
            Departure: document.getElementById("departure").value,
            Leave_dep: document.getElementById("leave_dep").value
        }

        await newEvent(_event)
        props.reload()
    }

    const clear = () => {
        setEvent({
            Event_ID: -1,
            Type: "",
            Location: "",
            Date: "",
            Begin: "",
            Departure: "",
            Leave_dep: ""
        })
    }

    return(
        <Form theme={formtheme} onSubmit={onSubmit} id="eventeditor">
            <FormBox>
                <Label>
                    <label htmlFor="type">Art:</label>
                </Label>
                <InputContainer>
                    <input type="text" name="" id="type" defaultValue={event.Type}/>
                </InputContainer>
            </FormBox>
            <FormBox>
                <Label>
                    <label htmlFor="location">Ort:</label>
                </Label>
                <InputContainer>
                    <input type="text" name="" id="location" defaultValue={event.Location}/>
                </InputContainer>
            </FormBox>
            <FormBox>
                <Label>
                    <label htmlFor="date">Datum:</label>
                </Label>
                <InputContainer>
                    <input type="text" name="" id="date" defaultValue={event.Date}/>
                </InputContainer>
            </FormBox>
            <FormBox>
                <Label>
                    <label htmlFor="begin">Startzeit:</label>
                </Label>
                <InputContainer>
                    <input type="text" name="" id="begin" defaultValue={event.Begin}/>
                </InputContainer>
            </FormBox>
            <FormBox>
                <Label>
                    <label htmlFor="departure">Abfahrt:</label>
                </Label>
                <InputContainer>
                    <input type="text" name="" id="departure" defaultValue={event.Departure}/>
                </InputContainer>
            </FormBox>
            <FormBox>
                <Label>
                    <label htmlFor="leave_dep">Rückfahrt:</label>
                </Label>
                <InputContainer>
                    <input type="text" name="" id="leave_dep" defaultValue={event.Leave_dep}/>
                </InputContainer>
            </FormBox>
            <FormBox>
                <InputContainer>
                    <input type="submit" value="Speichern" />
                    <button onClick={createNew}>Neu anlegen</button>
                    <button onClick={clear}>Felder leeren</button>
                </InputContainer>
            </FormBox>
        </Form>
    )
}

const SEditor = styled(Editor)`
    background: green;
`

const Event = (props) => {

    let Type = props.event.Type
    let Location = props.event.Location

    const onSelect = useCallback(() => {
        props.onSelect(props.event.Event_ID)
    }, [props])

    return(
        <div className={props.className} onClick={onSelect}>{Type} {Location}</div>
    )
}

const SEvent = styled(Event)`
    background: ${props => props.background};
    wrap: no-wrap;
    &:hover{
        background: lightgrey;
    }
`

const SEventEditor = styled(EventEditor)`
    position: relative;
    width: 100%;
    display: flex;
`
const FormBox = styled.div``
const Label = styled.div``
const InputContainer = styled.div``
const Form = styled.form`

    margin: ${props => props.theme.margin};
    width: 100%;

    input[type=submit], button {
        background-color: ${props => props.theme.secondary};
        color: ${props => props.theme.main};
        padding: ${props => props.theme.padding};
        margin: ${props => props.theme.input_margin};
        border: none;
        border-radius: 3px;
        cursor: pointer;
        float: right;
    }

    input[type=text], select {
        color: ${props => props.theme.main};
        width: 100%;
        padding: ${props => props.theme.padding};
        border: 1px solid ${props => props.theme.secondary};
        border-radius: 3px;
        box-sizing: border-box;
        resize: vertical;
        margin: ${props => props.theme.input_margin};
    }

    label {
        color: ${props => props.theme.main};
        padding: ${props => props.theme.padding};
        display: inline-block;
    }

    ${Label}{
        float: left;
        width: 25%;
        min-width: 80px;
        margin-top: 3px;
    }

    ${InputContainer}{
        float: left;
        width: 75%;
        margin-top: 3px;
    }

    ${FormBox}:after{
        content: "";
        display: table;
        clear: both;
    }
`

export default SEventEditor