import { useCallback, useEffect, useState } from 'react'
import { getAttendences, getEvents } from '../../modules/data/DBConnect'
import DateField from './DateField'
import Terminzusage from './Terminzusage'

const Termineingabe = ({dates, fullname}) => {

    const [ft, setFt] = useState(1)
    const [sf, setSf] = useState(1)
    const [events, setEvents] = useState(new Array(0))
    const [attendences, setAttendences] = useState(new Array(0))

    useEffect(() => {
        const fetchEvents = async () => {
            let _events = await getEvents('current')
            setEvents(_events)
            let _attendences = await getAttendences()
            setAttendences(_attendences)
        }
        fetchEvents()
    }, [])

    const onClick = useCallback((event_id) => {
        let index
        let att = (attendences.find((x, i) => {
            if(x.Event_ID===event_id){
                index = i
                return true
            }
            return false
        }).Attendence + 1) % 3
        let copy = attendences.splice(index)
        setAttendences([{Event_ID: event_id, Attendence: att}, ...copy])
        console.log(attendences)
    }, [attendences])

    const sendForm = (e) => {
        e.preventDefault()
        fetch("/api/abfrage.php", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"name": fullname, "ft_oeling": ft, "sf_ennest": sf})
        }).then((res) => {
            switch(res.status){
            case 201:
                alert("erfolgreich gesendet")
                setFt(1)
                setSf(1)
                break
            case 400:
                alert("Bitte Namen eintragen und erneut abschicken")
                break
            default:
            case 404:
                alert("Server nicht erreicht")
                break
            }
            
        })
    }

    return(
        <form onSubmit={sendForm} className="DateInput">
            <table>
                <thead>
                    <tr>
                        <td>Termin:</td>
                        <td>{fullname}</td>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, i) => {
                        let att = 0
                        let item = attendences.find(x => x.Event_ID === event.Event_ID)
                        if(item !== undefined){
                            att = item.Attendence
                        }
                        return(
                            <tr key={event.Location}>
                                <td><DateField dateprops={event} /></td>
                                <td><Terminzusage attendence={att} onClick={onClick} event_id={event.Event_ID}/></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <button type='submit'>Abschicken</button>
        </form>
    )
}

export default Termineingabe