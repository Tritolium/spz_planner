import { useCallback, useEffect, useState } from "react"

const Overview = () => {

    const options = [
        {value: "current", label: "Aktuell"},
        {value: "past", label: "Vergangen"},
        {value: "all", label: "Alle"}
    ]

    const [dates, setDates] = useState(new Array(0))
    const [filter, setFilter] = useState(options[0].value)

    useEffect(() => {
        const fetchData = async () => {
            fetch('http://spzroenkhausen.bplaced.net/api/event.php?mode=' + filter, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/JSON'
                }
            }).then(res => {
                if(res.status === 200) {
                    res.json().then(json => {
                        setDates(json)
                    })
                }
            })
        }
        if(process.env.NODE_ENV === 'production') {
            fetchData()
        } else {
            setDates([
                {
                    type: "Freundschaftstreffen",
                    location: "Oelinghauserheide",
                    date: "2022-05-14",
                    begin: "14:30:00",
                    departure: "14:00:00",
                    leave_dep: "12:34:56"
                },
                {
                    type: "Schützenfest",
                    location: "Ennest",
                    date: "2022-07-17",
                    begin: "12:34:56",
                    departure: "12:34:56",
                    leave_dep: "12:34:56"
                }
            ])
        }
    }, [filter])

    const filterChange = useCallback((e) => {
        setFilter(e.target.value)
        console.log(filter)
    }, [filter])

    return(
        <>
            <Filter options={options} onChange={filterChange}/>
            <table className="DateAdministrationOverview">
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
                            <tr key={date.date}>
                                <td>{date.type}</td>
                                <td>{date.location}</td>
                                <td className="DateAdministrationDate">{parseDate(date.date)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.begin)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.departure)}</td>
                                <td className="DateAdministrationTime">{parseTime(date.leave_dep)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

const Filter = (props) => {

    const onChange = useCallback((e) => {
        props.onChange(e)
    }, [props])

    return(
        <select onChange={onChange}>
            {props.options.map(option => {
                return(
                    <option value={option.value}>{option.label}</option>
                )
            })}
        </select>
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
