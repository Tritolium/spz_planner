import DateField from './DateField'
import Terminzusage from './Terminzusage'

import four from '../4.png'
import five from '../5.png'
import styled from 'styled-components'
import { useEffect, useState } from 'react'

const AttendenceTable = ({ attendences, fullname, states, selectedDateFilter, selectedEventFilter, onClick}) => {

    const [oneUsergroup, setOneUsergroup] = useState(true)

    useEffect(() => {
        setOneUsergroup(attendences.every(att => att.Usergroup_ID === attendences[0].Usergroup_ID))
    }, [attendences])

    return(
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
                            <TableData><Terminzusage states={states} attendence={att.Attendence} onClick={onClick} event_id={att.Event_ID} cancelled={att.Type.includes('Abgesagt')}/></TableData>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
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

export default AttendenceTable