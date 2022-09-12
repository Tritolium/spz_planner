import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SubmitButton from '../../../modules/components/SubmitButton'
import { getAttendences, updateAttendences } from '../../../modules/data/DBConnect'
import DateField from './DateField'
import Terminzusage from './Terminzusage'

const Termineingabe = ({fullname}) => {
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

    const sendForm = (e) => {
        e.preventDefault()
        updateAttendences(changedAttendences)
    }

    return(
        <Form onSubmit={sendForm} className="DateInput">
            <SubmitButton onClick={sendForm}>Abschicken</SubmitButton>
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
                            <tr key={att.Location + att.Event_ID}>
                                <TableData><DateField dateprops={att} /></TableData>
                                <TableData><Terminzusage states={2} attendence={att.Attendence} onClick={onClick} event_id={att.Event_ID}/></TableData>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Form>
    )
}

const Table = styled.table`
    border-collapse: collapse;
`

const TableData = styled.td`
    border-top: 1px solid #ccc;
`

const Form = styled.form`

    @media (max-width: ${({theme}) => theme.mobile}) {
        padding-bottom: 2rem;
    }
    
    box-sizing: border-box;
`

export default Termineingabe