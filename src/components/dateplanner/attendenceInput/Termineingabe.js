import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SubmitButton from '../../../modules/components/SubmitButton'
import { getAttendences, updateAttendences } from '../../../modules/data/DBConnect'
import DateField from './DateField'
import Terminzusage from './Terminzusage'

import four from '../4.png'
import five from '../5.png'

const Termineingabe = ({fullname}) => {

    /**
     * constant, maybe switch to fetch from server
     */
    const ATTENDENCE_STATES = 3

    /**
     * fetched from server
     */
    const [attendences, setAttendences] = useState(new Array(0))

    /**
     * local states
     */
    const [changedAttendences, setChangedAttendences] = useState({})
    const [selectedDateFilter, setSelectedDateFilter] = useState('all')
    const [selectedEventFilter, setSelectedEventFilter] = useState('all')
    const [oneUsergroup, setOneUsergroup] = useState(true)

    const fetchEvents = async () => {
        let _attendences = await getAttendences()
        if(_attendences !== undefined){
            setAttendences(_attendences)
            setOneUsergroup(_attendences.every(att => att.Usergroup_ID === _attendences[0].Usergroup_ID))
        }
    }

    const onClick = useCallback((event_id, attendence) => {
        let att = {...changedAttendences}
        att['' + event_id] = attendence
        setChangedAttendences(att)
    }, [changedAttendences])

    const onDateFilterChange = useCallback(e => {
        setSelectedDateFilter(e.target.value)
    }, [setSelectedDateFilter])

    const onEventFilterChange = useCallback(e => {
        setSelectedEventFilter(e.target.value)
    }, [setSelectedEventFilter])

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
                <select name='eventSelect' id='eventSelect' title='event select' onChange={onEventFilterChange}>
                    <option value='all'>Alle</option>
                    <option value='practice'>Üben/Probe</option>
                    <option value='else'>Auftritte etc.</option>
                </select>
                <select name="dateSelect" id="dateSelect" title='date select' onChange={onDateFilterChange}>
                    <option value="all">Alle</option>
                    <option value="one">1 Woche</option>
                    <option value="two">2 Wochen</option>
                    <option value="four">4 Wochen</option>
                    <option value="eight">8 Wochen</option>
                </select>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Termine: {oneUsergroup ? usergroupLogo(attendences[0]?.Usergroup_ID) : <></>}</th>
                        <th>{fullname}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {attendences
                    .filter(attendence => {
                        let attDate = new Date(attendence.Date)
                        attDate.setHours(23,59,59,999)
                        let today = new Date()
                        return today <= attDate
                    })
                    .filter(attendence => {
                        switch(selectedEventFilter){
                        default:
                        case 'all':
                            return true
                        case 'practice':
                            return attendence.Type.includes('Probe') || attendence.Type.includes('Üben')
                        case 'else':
                            return !(attendence.Type.includes('Probe') || attendence.Type.includes('Üben'))
                        }
                    })
                    .filter(attendence => {
                        let attDate = new Date(attendence.Date)
                        let today = new Date()
                        switch(selectedDateFilter){
                        default:
                        case 'all':
                            return true
                        case 'one':
                            return (attDate.getTime() - today.getTime()) < 1*604800000
                        case 'two':
                            return (attDate.getTime() - today.getTime()) < 2*604800000
                        case 'four':
                            return (attDate.getTime() - today.getTime()) < 4*604800000
                        case 'eight':
                            return (attDate.getTime() - today.getTime()) < 8*604800000                            
                        }
                    })
                    .map((att) => {

                        return(
                            <tr key={att.Location + att.Event_ID}>
                                {!oneUsergroup ? <TableData>{usergroupLogo(att.Usergroup_ID)}</TableData> : <></>}
                                <TableData><DateField dateprops={att} /></TableData>
                                <TableData><Terminzusage states={ATTENDENCE_STATES} attendence={att.Attendence} onClick={onClick} event_id={att.Event_ID} cancelled={att.Type.includes('Abgesagt')}/></TableData>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Form>
    )
}

const usergroupLogo = (usergroup_id) => {
    let id = parseInt(usergroup_id)
    switch(id){
    case 4:
        return <img src={four} alt="Logo Rönk"/>
    case 5:
        return <img src={five} alt="Logo Dün"/>
    case 7:
        return <img src="https://sgv.de/assets/images/1/logo_sgv_web-fc5e97ec.svg" alt="Logo SGV" />
    default:
        return <></>
    }
}

const Table = styled.table`
    border-collapse: collapse;

    img {
        max-height: 64px;
        max-width: 64px;
    }

    th {
        img {
            transform: translateY(20%);
            max-height: 27px;
            max-width: 128px;
        }
    }
`

const TableData = styled.td`
    border-top: 1px solid #ccc;
    :nth-child(1) {
        text-align: center;
    }
    :nth-child(2) {
        text-align: center;
    }
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