import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SubmitButton from '../../../modules/components/SubmitButton'
import { getAttendences, updateAttendences } from '../../../modules/data/DBConnect'
import DateField from './DateField'
import Terminzusage from './Terminzusage'

const Termineingabe = ({fullname}) => {

    /**
     * fetched from server
     */
    const [attendences, setAttendences] = useState(new Array(0))

    /**
     * local states
     */
    const [changedAttendences, setChangedAttendences] = useState({})
    const [selectedFilter, setSelectedFilter] = useState('all')

    const fetchEvents = async () => {
        let _attendences = await getAttendences()
        setAttendences(_attendences)
    }

    const onClick = useCallback((event_id, attendence) => {
        let att = {...changedAttendences}
        att['' + event_id] = attendence
        setChangedAttendences(att)
    }, [changedAttendences])

    const onFilterChange = useCallback(e => {
        setSelectedFilter(e.target.value)
    }, [setSelectedFilter])

    const sendForm = (e) => {
        e.preventDefault()
        updateAttendences(changedAttendences)
        fetchEvents()
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return(
        <Form onSubmit={sendForm} className="DateInput">
            <div>
                <SubmitButton onClick={sendForm}>Speichern</SubmitButton>
                <select name="dateSelect" id="dateSelect" onChange={onFilterChange}>
                    <option value="all">Alle</option>
                    <option value="one">1 Woche</option>
                    <option value="two">2 Wochen</option>
                    <option value="four">4 Wochen</option>
                </select>
            </div>
            <Table>
                <thead>
                    <tr>
                        <td>Termin:</td>
                        <td>{fullname}</td>
                    </tr>
                </thead>
                <tbody>
                    {attendences
                    .filter(attendence => {
                        let attDate = new Date(attendence.Date)
                        let today = new Date()
                        switch(selectedFilter){
                        default:
                        case 'all':
                            return true
                        case 'one':
                            return (attDate.getTime() - today.getTime()) < 604800000
                        case 'two':
                            return (attDate.getTime() - today.getTime()) < 1209600000
                        case 'four':
                            return (attDate.getTime() - today.getTime()) < 2419200000
                        }
                    })
                    .map((att, i) => {
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

    flex-direction: column;

    @media (max-width: ${({theme}) => theme.mobile}) {
        padding-bottom: 2rem;
    }
    
    box-sizing: border-box;

    select {
        padding: 2px;
        margin: 2px;
        border-radius: 5px;
    }

    > div {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
`

export default Termineingabe