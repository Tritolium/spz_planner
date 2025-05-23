import { useCallback, useEffect, useState } from "react"
import { Clothing } from "../../../modules/components/icons/Clothing"
import Filter from "../../../modules/components/Filter"
import { getEvents } from "../../../modules/data/DBConnect"
import { StyledEventTable, StyledEventTableMobile, StyledOverview } from "./Overview.styled"
import { EVENT_STATE } from "../eventform/EventForm"


const Overview = () => {

    const options = [
        {value: "current", label: "Aktuell"},
        {value: "past", label: "Vergangen"},
        {value: "all", label: "Alle"}
    ]

    const event_options = [
        {value: "event", label: "Auftritt"},
        {value: "practice", label: "Probe/Üben"},
        {value: "other", label: "Sonstige Termine"},
        {value: "all", label: "Alle"}
    ]

    const [events, setEvents] = useState(new Array(0))
    const [filter, setFilter] = useState(options[0].value)
    const [eventfilter, setEventfilter] = useState(event_options[0].value)

    const fetchEvents = useCallback(async () => {
        let _events = await getEvents(filter)
        _events = _events.filter(event => {
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
        _events = _events.filter(event => {
            return event.State === EVENT_STATE.CONFIRMED || event.State === EVENT_STATE.PENDING
        })
        if(_events !== undefined)
            setEvents(_events)
    }, [filter])

    const onFilterChange = useCallback((e) => {
        setFilter(e.target.value)
    }, [setFilter])

    const onEventFilterChange = useCallback((e) => {
        setEventfilter(e.target.value)
    }, [setEventfilter])

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEvents()
        }, 5000)
        fetchEvents()
        return () => {
            clearInterval(interval)
        }
    }, [fetchEvents])

    return(
        <StyledOverview>
            <a href={`webcal://spzroenkhausen.bplaced.net/api/v0/calendar?api_token=${localStorage.getItem('api_token')}`} target="_blank">&rarr;Termine mit Kalender synchronisieren&larr;</a>
            <div>
                <Filter options={options} onChange={onFilterChange}/>
                <Filter options={event_options} onChange={onEventFilterChange}/>
            </div>
            <EventList events={events} eventfilter={eventfilter}/>
            <EventListMobile events={events} eventfilter={eventfilter}/>
        </StyledOverview>
    )
}

const EventList = ({ events, eventfilter }) => {
    return(
        <StyledEventTable>
            <thead>
                <tr>
                    <th>Ort</th>
                    <th>Datum</th>
                    <th>Beginn</th>
                    <th>Abfahrt</th>
                    <th>Rückfahrt</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {events.map(event => {
                    return(<Event key={`event_${event.Event_ID}`} event={event} />)
                })}
            </tbody>
        </StyledEventTable>
    )
}

const EventListMobile = ({ events, eventfilter }) => {
    return(
        <StyledEventTableMobile>
            <thead>
                <tr>
                    <th>Ort/Datum</th>
                    <th>Beginn/Abfahrt</th>
                    <th>Rückfahrt</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {events.map(event => {
                    return(<EventMobile key={`m_event_${event.Event_ID}`} event={event} />)
                })}
            </tbody>
        </StyledEventTableMobile>
    )
}

const Event = ({ event }) => {
    return(
        <tr>
            <td>{event.Type} {event.Location}</td>
            <td>{parseDate(event.Date)}</td>
            <td>{parseTime(event.Begin)}</td>
            <td>{parseTime(event.Departure)}</td>
            <td>{parseTime(event.Leave_dep)}</td>
            <td>{event.Clothing === 0 ? <></> : <Clothing clothing={event.Clothing}/>}</td>
        </tr>
    )
}

const EventMobile = ({ event }) => {
    return(
        <tr>
            <td>{event.Type} {event.Location} {parseDate(event.Date)}</td>
            <td>{parseTime(event.Begin)}<br />{parseTime(event.Departure)}</td>
            <td>{parseTime(event.Leave_dep)}</td>
            <td>{event.Clothing === 0 ? <></> : <Clothing clothing={event.Clothing}/>}</td>
        </tr>
    )
}

const parseDate = (datestring) => {
    var split = datestring.split('-')
    var year = parseInt(split[0])
    var month = parseInt(split[1])
    var day = parseInt(split[2])
    return(day + '.' + month + '.' + year)
}

const parseTime = (timestring) => {
    if(timestring === '12:34:56' || timestring === null || timestring === undefined){
        return("---")
    }
    var split = timestring.split(':')
    var hour = split[0]
    var minutes = split[1]
    return(hour + ':' + minutes + ' Uhr')
}

export default Overview