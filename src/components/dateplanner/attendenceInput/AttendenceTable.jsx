import DateField from './DateField'
import PlusOne from '../../../modules/components/icons/PlusOne'
import OwnArrival from '../../../modules/components/icons/OwnArrival'

import four from '../4.png'
import five from '../5.png'
import { useEffect, useState } from 'react'
import { updateAttendence } from '../../../modules/data/DBConnect'
import { StyledAttendenceTable, StyledEvent, StyledMultiEvent } from './AttendenceTable.styled'
import { EVENT_STATE } from '../../dateadministration/eventform/EventForm'
import { getWeeknumber } from '../../../modules/helper/DateFormat'
import { AttendenceInput } from './AttendenceInput'

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
            case 'pending':
                return attendence.Attendence === -1
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
        .filter(attendence => {
            return attendence.State !== EVENT_STATE.CANCELED
        })
        setFilteredAttendences(filtered)
    }, [attendences, selectedDateFilter, selectedEventFilter])

    return(<>
        <StyledAttendenceTable>
            {filteredAttendences.map((att, i) => {
                let flags = {sameDay: false, diffWeek: false}
                if(i > 0){
                    let prevDate = new Date(filteredAttendences[i-1].Date)
                    let curDate = new Date(att.Date)
                    flags.sameDay = prevDate.getDate() === curDate.getDate() && prevDate.getMonth() === curDate.getMonth() && prevDate.getFullYear() === curDate.getFullYear()
                    flags.diffWeek = getWeeknumber(prevDate) !== getWeeknumber(curDate)
                }

                return(
                    <Event key={att.Location + att.Event_ID} att={att} states={states} oneAssociation={oneAssociation} flags={flags} theme={theme} />
                )})
            }
        </StyledAttendenceTable>
        </>
    )
}

const Event = ({ att, oneAssociation, flags, theme }) => {

    const [plusone, setPlusone] = useState(att.PlusOne)
    const [ownArrival, setOwnArrival] = useState(att.OwnArrival)
    const [attendence, setAttendence] = useState(att.Attendence)

    const onClick = async (event_id, new_att) => {
        await updateAttendence(event_id, new_att, plusone, ownArrival)
        setAttendence(new_att)
    }

    const togglePlusOne = async () => {
        if(attendence === 1){
            await updateAttendence(att.Event_ID, attendence, !plusone, ownArrival)
            setPlusone(!plusone)
        }
    }

    const toggleOwnArrival = async () => {
        if(attendence === 1){
            await updateAttendence(att.Event_ID, attendence, plusone, !ownArrival)
            setOwnArrival(!ownArrival)
        }
    }

    let classname = att.State === 0 ? 'event pending' : 'event'

    if (flags.sameDay) 
        classname += ' sameDay'
    else if (flags.diffWeek)
        classname += ' diffWeek'

    if (oneAssociation) {
        return(
            <StyledEvent className={classname} key={att.Location + att.Event_ID}>
                <DateField dateprops={att} />
                <AttendenceInput event={att} attendence={attendence} onClick={onClick} theme={theme}/>
                {att.Ev_PlusOne ? <PlusOne active={attendence === 1} plusOne={plusone} onClick={togglePlusOne} theme={theme} className="PlusOne" /> : <></>}
                <OwnArrival active={attendence === 1} ownArrival={ownArrival} onClick={toggleOwnArrival} theme={theme} className="OwnArrival" />
            </StyledEvent>
        )
    }

    return(
        <StyledMultiEvent className={classname} key={att.Location + att.Event_ID}>
            {associationLogo(att.Association_ID)}
            <DateField dateprops={att} />
            <AttendenceInput event={att} attendence={attendence} onClick={onClick} theme={theme}/>
            {att.Ev_PlusOne ? <PlusOne active={attendence === 1} plusOne={plusone} onClick={togglePlusOne} theme={theme} className="PlusOne" /> : <></>}
            <OwnArrival active={attendence === 1} ownArrival={ownArrival} onClick={toggleOwnArrival} theme={theme} className="OwnArrival" />
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
        return <img src="https://sgv.de/assets/images/m/logo-sgv-min-6xncret2maqs1cp.svg" alt="Logo SGV" />
    default:
        return <></>
    }
}

export default AttendenceTable