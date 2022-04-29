import { useEffect, useState } from "react"

const Overview = () => {

    const [dates, setDates] = useState(new Array(0))

    useEffect(() => {
        const fetchData = async () => {
            fetch('http://spzroenkhausen.bplaced.net/api/dates.php', {
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
                    Type: "Freundschaftstreffen",
                    Location: "Oelinghauserheide",
                    Date: "2022-05-14",
                    Begin: "14:30:00",
                    Departure: "14:00:00",
                    Leave: ""
                }
            ])
        }
    }, [])

    return(
        <table>
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
                            <td>{parseDate(date.Date)}</td>
                            <td>{parseTime(date.Begin)}</td>
                            <td>{parseTime(date.Departure)}</td>
                            <td>{parseTime(date.Leave)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
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
    if(timestring === ''){
        return("---")
    }
    var split = timestring.split(':')
    var hour = split[0]
    var minutes = split[1]
    return(hour + ':' + minutes + ' Uhr')
}

export default Overview