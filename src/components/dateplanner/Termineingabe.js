import { useCallback, useEffect, useState } from 'react'
import { getAttendences } from '../../modules/data/DBConnect'
import DateField from './DateField'
import Terminzusage from './Terminzusage'

const Termineingabe = ({dates, fullname}) => {
    const [attendences, setAttendences] = useState(new Array(0))
    const [changedAttendences, setChangedAttendences] = useState({})

    useEffect(() => {
        const fetchEvents = async () => {
            let _attendences = await getAttendences()
            setAttendences(_attendences)
        }
        fetchEvents()
    }, [])

    const onClick = useCallback((event_id, attendence) => {
        let att = {...changedAttendences}
        att[event_id] = attendence
        setChangedAttendences(att)
        console.log(att)
    }, [changedAttendences])

    const sendForm = (e) => {
        e.preventDefault()
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
                    {attendences.map((att, i) => {
                        return(
                            <tr key={att.Location}>
                                <td><DateField dateprops={att} /></td>
                                <td><Terminzusage attendence={att.Attendence} onClick={onClick} event_id={att.Event_ID}/></td>
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