import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { getAttendences, updateAttendences } from '../../../modules/data/DBConnect'
import DateField from './DateField'
import Terminzusage from './Terminzusage'

const Termineingabe = ({dates, fullname}) => {
    const [attendences, setAttendences] = useState(new Array(0))
    const [changedAttendences, setChangedAttendences] = useState({})

    useEffect(() => {
        const fetchEvents = async () => {
            let _attendences = await getAttendences(false)
            setAttendences(_attendences)
        }
        fetchEvents()
    }, [])

    const onClick = useCallback((event_id, attendence) => {
        let att = {...changedAttendences}
        att['' + event_id] = attendence
        setChangedAttendences(att)
    }, [changedAttendences])

    const sendForm = (e) => {
        e.preventDefault()
        updateAttendences(changedAttendences)
    }

    return(
        <form onSubmit={sendForm} className="DateInput">
            <button type='submit'>Abschicken</button>
            <Table>
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
                                <TableData><DateField dateprops={att} /></TableData>
                                <TableData><Terminzusage states={2} attendence={att.Attendence} onClick={onClick} event_id={att.Event_ID}/></TableData>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <button type='submit'>Abschicken</button>
        </form>
    )
}

const Table = styled.table`
    border-collapse: collapse;
`

const TableData = styled.td`
    border-top: 1px solid #ccc;
`

export default Termineingabe