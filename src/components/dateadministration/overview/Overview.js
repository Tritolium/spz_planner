import { useCallback, useEffect, useState } from "react"
import Filter from "../../../modules/components/Filter"
import { getEvents } from "../../../modules/data/DBConnect"
import { StyledEventTable, StyledEventTableMobile, StyledOverview } from "./Overview.styled"


const Overview = () => {

    const options = [
        {value: "current", label: "Aktuell"},
        {value: "past", label: "Vergangen"},
        {value: "all", label: "Alle"}
    ]

    const [events, setEvents] = useState(new Array(0))
    const [filter, setFilter] = useState(options[0].value)

    const fetchEvents = useCallback(async () => {
        let _events = await getEvents(filter)
        if(_events !== undefined)
            setEvents(_events)
    }, [filter])

    const onFilterChange = useCallback((e) => {
        setFilter(e.target.value)
    }, [setFilter])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    return(
        <StyledOverview>
            <Filter options={options} onChange={onFilterChange}/>
            <EventList events={events} />
            <EventListMobile events={events} />
        </StyledOverview>
    )
}

const EventList = ({ events }) => {
    return(
        <StyledEventTable>
            <thead>
                <tr>
                    <th>Ort</th>
                    <th>Datum</th>
                    <th>Beginn</th>
                    <th>Abfahrt</th>
                    <th>Rückfahrt</th>
                </tr>
            </thead>
            <tbody>
                {events.map(event => {
                    return(<Event event={event} />)
                })}
            </tbody>
        </StyledEventTable>
    )
}

const EventListMobile = ({ events }) => {
    return(
        <StyledEventTableMobile>
            <thead>
                <tr>
                    <th>Ort/Datum</th>
                    <th>Beginn</th>
                    <th>Abfahrt</th>
                    <th>Rückfahrt</th>
                </tr>
            </thead>
            <tbody>
                {events.map(event => {
                    return(<EventMobile event={event} />)
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
        </tr>
    )
}

const EventMobile = ({ event }) => {
    return(
        <tr>
            <td>{event.Type} {event.Location} {parseDate(event.Date)}</td>
            <td>{parseTime(event.Begin)}</td>
            <td>{parseTime(event.Departure)}</td>
            <td>{parseTime(event.Leave_dep)}</td>
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
    if(timestring === '12:34:56'){
        return("---")
    }
    var split = timestring.split(':')
    var hour = split[0]
    var minutes = split[1]
    return(hour + ':' + minutes + ' Uhr')
}

export default Overview