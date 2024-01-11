import DateField from './DateField'
import Terminzusage from './Terminzusage'
import PlusOne from '../../../modules/components/icons/PlusOne'

import four from '../4.png'
import five from '../5.png'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { updateAttendences } from '../../../modules/data/DBConnect'

const AttendenceTable = ({ attendences, fullname, states, selectedDateFilter, selectedEventFilter, theme}) => {

    const [oneAssociation, setOneAssociation] = useState(true)

    useEffect(() => {
        setOneAssociation(attendences.every(att => att.Association_ID === attendences[0].Association_ID))
    }, [attendences])

    return(
        <Table>
            <thead>
                <tr>
                    <th>Termine: {oneAssociation ? associationLogo(attendences[0]?.Association_ID) : <></>}</th>
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
                        return attendence.Category === 'practice'
                    case 'event':
                        return attendence.Category === 'event'
                    case 'other':
                        return attendence.Category === 'other'
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
                        <Event key={att.Location + att.Event_ID} att={att} states={states} oneAssociation={oneAssociation} theme={theme} />
                    )
                })}
            </tbody>
        </Table>
    )
}

const Event = ({ att, states, oneAssociation, theme }) => {
    const [plusone, setPlusone] = useState(att.PlusOne)
    const [attendence, setAttendence] = useState(att.Attendence)

    const onClick = async () => {
        let changes = {}
        let newAttendence = (attendence + 1) % states
        changes[att.Event_ID] = [newAttendence, plusone]
        await updateAttendences(changes, false)
        setAttendence(newAttendence)
    }

    const togglePlusOne = async () => {
        if(attendence === 1){
            let changes = {}
            changes[att.Event_ID] = [attendence, !plusone]
            await updateAttendences(changes, false)
            setPlusone(!plusone)
        }

    }

    return(
        <tr key={att.Location + att.Event_ID}>
            {!oneAssociation ? <TableData>{associationLogo(att.Association_ID)}</TableData> : <></>}
            <TableData><DateField dateprops={att} /></TableData>
            <TableData><Terminzusage event={att} states={states} attendence={attendence} onClick={onClick} event_id={att.Event_ID} cancelled={att.Type.includes('Abgesagt')} theme={theme}/></TableData>
            {att.Ev_PlusOne ? <TableData><PlusOne active={attendence === 1} plusOne={plusone} onClick={togglePlusOne} theme={theme} /></TableData> : <TableData></TableData>}
        </tr>
    )
}

const associationLogo = (association_id) => {
    const id = parseInt(association_id)
    switch(id){
    case 1:
        return <img src={four} alt="Logo Rönk"/>
    case 2:
        return <img src={five} alt="Logo Dün"/>
    case 3:
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

    tr {
        td:nth-child(1) {
            text-align: center;
        }
        :nth-child(2) {
            text-align: center;
        }
    }
`

const TableData = styled.td`
    border-top: 1px solid #ccc;
`

export default AttendenceTable