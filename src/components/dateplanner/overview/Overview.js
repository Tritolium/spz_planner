import { useCallback, useEffect, useState } from "react"

import { getAllAttendences, getEvalByUsergroup, getOwnUsergroups } from '../../../modules/data/DBConnect'

import DateField from "../attendenceInput/DateField"
import { StyledEvalTable, StyledOverview, StyledOverviewTable } from "./Overview.styled"
import EvalDiagram from "./EvalDiagram"
import { Alert, Blank, Check, Deny } from "../attendenceInput/Terminzusage"
import { IoReload } from "react-icons/io5"

const Overview = ({ theme }) => {

    const [usergroups, setUsergroups] = useState(new Array(0))
    const [selectedUsergroup_ID, setSelectedUsergroup_ID] = useState()

    const [attendences, setAttendences] = useState(new Array(0))
    const [evaluation, setEvaluation] = useState(new Array(0))
    //const [missingFeedback, setMissingFeedback] = useState(new Array(0))

    const fetchUsergroups = async () => {
        let _usergroups = await getOwnUsergroups()
        setUsergroups(_usergroups)
    }

    const fetchAttendences = useCallback(async () => {
        let _attendences = await getAllAttendences(selectedUsergroup_ID)
        setAttendences(_attendences)
    }, [selectedUsergroup_ID])

    /*
    const fetchMissingFeedback = async () => {
        let _missingFeedback = await getMissingFeedback()
        setMissingFeedback(_missingFeedback)
    }
    */

    const fetchEval = useCallback(async () => {
        let _eval = await getEvalByUsergroup(selectedUsergroup_ID)
        setEvaluation(_eval)
    }, [selectedUsergroup_ID])

    const onUsergroupChange = useCallback((e) => {
        setSelectedUsergroup_ID(e.target.value)
    }, [setSelectedUsergroup_ID])

    const reload = useCallback(() => {
        fetchAttendences()
        fetchEval()
    }, [fetchAttendences, fetchEval])

    useEffect(() => {
        fetchUsergroups()
        reload()
    }, [reload])

    if(attendences.length === 0){
        return(
            <select name="usergroup" id="usergroup_select" onChange={onUsergroupChange}>
                {usergroups.map((usergroup, index) => {
                    return(<option key={index} value={usergroup.Usergroup_ID}>{usergroup.Title}</option>)
                })}
            </select>
        )
    } else {
        return(
            <StyledOverview>
                <div>
                    <select name="usergroup" id="usergroup_select" onChange={onUsergroupChange}>
                        {usergroups.map((usergroup, index) => {
                            return(<option key={index} value={usergroup.Usergroup_ID}>{usergroup.Title}</option>)
                        })}
                    </select>
                    <IoReload onClick={reload}/>
                </div>
                <OverviewTable attendences={attendences} theme={theme}/>
                <EvalTable evaluation={evaluation} theme={theme}/>
            {/*Fehlende Rückmeldungen:*/}
            {/*missingFeedback.map(missing => {
                return(<div>{missing.Forename} {missing.Surname}</div>)
            })*/}
            </StyledOverview>
        )
    }
}

export const Zusage = ({attendence, theme}) => {
    switch(attendence){
    default:
    case -1:
        return(<Blank theme={theme}/>)
    case 0:
        return(<Deny theme={theme}/>)
    case 1:
        return(<Check theme={theme}/>)
    case 2:
        return(<Alert theme={theme}/>)
    }
}

const OverviewTable = ({attendences, theme}) => {
    return(
        <StyledOverviewTable>
            <thead>
                <tr>
                    <th>Termin:</th>
                    {attendences[0].Attendences.map((att) => {
                        return(<th key={att.Fullname}>{att.Fullname.split(' ')[0].slice(0, 2)}{att.Fullname.split(' ')[1][0]}</th>)
                    })}
                </tr>
            </thead>
            <tbody>
                {
                    attendences.map(event => {
                        return(
                            <tr key={event.Event_ID}>
                                <td><DateField dateprops={event}/></td>
                                {event.Attendences.map(attendence => {
                                    return(<td key={attendence.Fullname + event.Event_ID}><Zusage attendence={attendence.Attendence} theme={theme}/></td>)
                                })}
                            </tr>
                        )
                    })
                }
            </tbody>
            </StyledOverviewTable>
    )
}

const EvalTable = ({evaluation, theme}) => {
    return(
        <StyledEvalTable>
            <thead>
                <th>Termin</th>
                <th>Zu.</th>
                <th>Ab.</th>
                <th>Aus.</th>
                <th>Vllt.</th>
                <th>M</th>
                <th>S</th>
                <th>D</th>
                <th>A</th>
                <th>T</th>
                <th>L</th>
                <th>Tr</th>
                <th>B</th>
                <th>P</th>
            </thead>
            <tbody>
                {evaluation.map(event => {
                    return(<EvalRow event={event} key={`eval_${event.Event_ID}`} theme={theme}/>)
                })}
            </tbody>
        </StyledEvalTable>
    )
}

const EvalRow = ({ event, theme }) => {
    return(
        <tr>
            <td><DateField dateprops={event} /></td>
            <td>{event.Consent}</td>
            <td>{event.Refusal}</td>
            <td>{event.Missing}</td>
            <td>{event.Maybe}</td>
            <td>{event.Instruments.Major}</td>
            <td>{event.Instruments.Sopran}</td>
            <td>{event.Instruments.Diskant}</td>
            <td>{event.Instruments.Alt}</td>
            <td>{event.Instruments.Tenor}</td>
            <td>{event.Instruments.Lyra}</td>
            <td>{event.Instruments.Trommel}</td>
            <td>{event.Instruments.Becken}</td>
            <td>{event.Instruments.Pauke}</td>
            <EvalDiagram event={event} theme={theme}/>
        </tr>
    )
}

export default Overview