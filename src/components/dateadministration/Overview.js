import { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import Filter from "../../modules/components/Filter"
import { getEvents } from "../../modules/data/DBConnect"

const Overview = (props) => {

    const options = [
        {value: "current", label: "Aktuell"},
        {value: "past", label: "Vergangen"},
        {value: "all", label: "Alle"}
    ]

    const [dates, setDates] = useState(new Array(0))
    const [filter, setFilter] = useState(options[0].value)

    useEffect(() => {
        const fetchData = async () => {
            let _events = await getEvents(filter)
            setDates(_events)
        }
        fetchData()
    }, [filter])

    const filterChange = useCallback((e) => {
        setFilter(e.target.value)
    }, [])

    return(
        <>
            <Filter options={options} onChange={filterChange}/>
            <StyledDesktopTable className="DateAdministrationOverview">
                <thead>
                    <tr>
                        <th></th>
                        <th>Ort</th>
                        <th>Datum</th>
                        <th>Beginn</th>
                        <th>Abfahrt</th>
                        <th>Rückfahrt</th>
                    </tr>
                </thead>
                <tbody>
                    {dates.map(date => {
                        return (
                            <tr key={date.Date}>
                                <td>{date.Type}</td>
                                <td>{date.Location}</td>
                                <td className="DateAdministrationDate">{parseDate(date.Date)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.Begin)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.Departure)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.Leave_dep)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </StyledDesktopTable>
            <StyledMobileTable>
                <thead>
                    <tr>
                        <th>Ort/Datum</th>
                        <th>Beginn</th>
                        <th>Abfahrt</th>
                        <th>Rückfahrt</th>
                    </tr>
                </thead>
                <tbody>
                    {dates.map(date => {
                        return (
                            <tr key={date.Date}>
                                <td>{date.Type}<br />{date.Location}<br />{parseDate(date.Date)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.Begin)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.Departure)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.Leave_dep)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </StyledMobileTable>
        </>
    )
}

const Table = styled.table`
    margin: 4px;
    border-spacing: 1px;
    border-collapse: collapse;
    border: 1px solid black;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        width: 100%;
        th {
            padding: 1px;
        }

        td {
            padding: 4px;
        }
    }

    th {
        border: 1px solid black;
        padding: 4px;
    }

    td {
        border-top: 1px solid black;
        padding: 8px;
    }
`

const StyledDesktopTable = styled(Table)`
    display: table;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: none;
    }
`

const StyledMobileTable = styled(Table)`
    display: none;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: table;
    }
`

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
