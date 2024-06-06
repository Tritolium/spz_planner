import DateField from './DateField'
import Terminzusage from './Terminzusage'
import PlusOne from '../../../modules/components/icons/PlusOne'

import four from '../4.png'
import five from '../5.png'
import { useEffect, useState } from 'react'
import { updateAttendence } from '../../../modules/data/DBConnect'
import { StyledAttendenceTable, StyledEvent, StyledMultiEvent } from './AttendenceTable.styled'

const AttendenceTable = ({ attendences, states, selectedDateFilter, selectedEventFilter, theme}) => {

    const [oneAssociation, setOneAssociation] = useState(true)
    const [filteredAttendences, setFilteredAttendences] = useState(attendences)

    useEffect(() => {
        const firstAssociationId = attendences[0]?.Association_ID;
        let oneAssociation = true;

        for (let i = 1; i < attendences.length; i++) {
            if (attendences[i].Association_ID !== firstAssociationId) {
                oneAssociation = false;
                break;
            }
        }

        setOneAssociation(oneAssociation);
    }, [attendences])

    useEffect(() => {
        // filter attendences
        let filtered = attendences
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
        setFilteredAttendences(filtered)
    }, [attendences, selectedDateFilter, selectedEventFilter])

    return(<>
        <StyledAttendenceTable>
            {filteredAttendences.map((att) => {
                return(
                    <Event key={att.Location + att.Event_ID} att={att} states={states} oneAssociation={oneAssociation} theme={theme} />
                )})
            }
        </StyledAttendenceTable>
        </>
    )
}

const Event = ({ att, states, oneAssociation, theme }) => {
    const [plusone, setPlusone] = useState(att.PlusOne)
    const [attendence, setAttendence] = useState(att.Attendence)

    const onClick = async () => {
        let newAttendence = (attendence + 1) % states
        await updateAttendence(att.Event_ID, newAttendence, plusone)
        setAttendence(newAttendence)
    }

    const togglePlusOne = async () => {
        if(attendence === 1){
            await updateAttendence(att.Event_ID, attendence, !plusone)
            setPlusone(!plusone)
        }

    }

    if (oneAssociation) {
        return(
            <StyledEvent key={att.Location + att.Event_ID}>
                <DateField dateprops={att} />
                <Terminzusage event={att} states={states} attendence={attendence} onClick={onClick} event_id={att.Event_ID} cancelled={att.Type.includes('Abgesagt')} theme={theme}/>
                {att.Ev_PlusOne ? <PlusOne active={attendence === 1} plusOne={plusone} onClick={togglePlusOne} theme={theme} className="PlusOne" /> : <></>}
            </StyledEvent>
        )
    }

    return(
        <StyledMultiEvent key={att.Location + att.Event_ID}>
            {associationLogo(att.Association_ID)}
            <DateField dateprops={att} />
            <Terminzusage event={att} states={states} attendence={attendence} onClick={onClick} event_id={att.Event_ID} cancelled={att.Type.includes('Abgesagt')} theme={theme}/>
            {att.Ev_PlusOne ? <PlusOne active={attendence === 1} plusOne={plusone} onClick={togglePlusOne} theme={theme} className="PlusOne" /> : <></>}
        </StyledMultiEvent>
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

export default AttendenceTable