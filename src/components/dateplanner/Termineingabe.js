import { useCallback, useEffect, useState } from 'react'
import { getAttendences, updateAttendences } from '../../modules/data/DBConnect'
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
        att['' + event_id] = attendence
        setChangedAttendences(att)
    }, [changedAttendences])

    const sendForm = async (e) => {
        e.preventDefault()
        let success = await updateAttendences(changedAttendences)
        if(success){
            alert("Angaben übernommen")
        } else {
            alert("Ein Fehler ist aufgetreten")
        }
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