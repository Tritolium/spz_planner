import { useCallback, useEffect, useState } from "react"

import { getAllAttendences, getEvalByUsergroup, getOwnUsergroups } from '../../../modules/data/DBConnect'

import DateField from "../attendenceInput/DateField"
import { StyledEvalTable, StyledOverview } from "./Overview.styled"
import EvalDiagram from "./EvalDiagram"
import { Alert, Blank, Check, Deny, PlusOne } from "../attendenceInput/Terminzusage"
import { IoReload } from "react-icons/io5"
import { OverviewTable } from "./OverviewTable"
import { hasPermission } from "../../../modules/helper/Permissions"
import { ImSpinner10 } from "react-icons/im"
import pedro from "../../../modules/img/racoon.gif"

const Overview = ({ theme }) => {

    const [usergroups, setUsergroups] = useState(new Array(0))
    const [selectedUsergroup_ID, setSelectedUsergroup_ID] = useState()

    const [attendences, setAttendences] = useState(new Array(0))
    const [evaluation, setEvaluation] = useState(new Array(0))

    const [loading, setLoading] = useState(false)

    const fetchUsergroups = async () => {
        let _usergroups = await getOwnUsergroups()
        _usergroups = _usergroups.filter(usergroup => hasPermission(7, usergroup.Association_ID))
        setUsergroups(_usergroups)
    }

    const fetchAttendences = useCallback(async () => {
        setLoading(true)
        let _attendences = await getAllAttendences(selectedUsergroup_ID)
        setAttendences(_attendences)
        setLoading(false)
    }, [selectedUsergroup_ID])

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
        reload()
    }, [reload])

    useEffect(() => {
        fetchUsergroups()
    }, [])

    useEffect(() => {
        setSelectedUsergroup_ID(usergroups[0]?.Usergroup_ID)
    }, [usergroups])

    if(attendences.length === 0 || loading){
        return(<StyledOverview>
            <select name="usergroup" id="usergroup_select" onChange={onUsergroupChange}>
                {usergroups.map((usergroup, index) => {
                    return(<option key={index} value={usergroup.Usergroup_ID}>{usergroup.Title}</option>)
                })}
            </select>
            {loading ? theme.pedro ? <img src={pedro} className="pedro" alt="Loading" /> : <ImSpinner10 className="spinner"/> : <></>}
        </StyledOverview>)
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
                <EvalTable evaluation={evaluation} attendences={attendences} theme={theme}/>
            </StyledOverview>
        )
    }
}

export const Zusage = ({attendence, plusone, theme, prediction}) => {
    if(attendence === 1 && plusone === 1)
        return(<PlusOne theme={theme} className="PlusOneIcon"/>)
    switch(attendence){
    default:
    case -1:
        return(<Blank theme={theme} overlay={prediction}/>)
    case 0:
        return(<Deny theme={theme}/>)
    case 1:
        return(<Check theme={theme}/>)
    case 2:
        return(<Alert theme={theme}/>)
    }
}



const EvalTable = ({evaluation, attendences, theme}) => {

    const [instruments, setInstruments] = useState(new Array(0))

    useEffect(() => {
        let _instruments = new Set()
        attendences[0].Attendences.forEach(attendence => {
            if(attendence.Instrument === "")
                _instruments.add("Unbekannt")
            else
                _instruments.add(attendence.Instrument)
        })
        setInstruments(Array.from(_instruments).sort())
    }, [attendences])

    return(
        <StyledEvalTable>
            <thead>
                <tr>
                    <th>Termin</th>
                    <th colSpan={2}>Zu.</th>
                    <th>Ab.</th>
                    <th>Aus.</th>
                    <th>Vllt.</th>
                    {instruments.map(instrument => {
                        return(<th key={instrument}>{instrument}</th>)
                    })}
                </tr>
            </thead>
            <tbody>
                {evaluation.map(event => {
                    return(<EvalRow event={event} attendences={attendences.find(att => att.Event_ID === event.Event_ID)?.Attendences} instruments={instruments} key={`eval_${event.Event_ID}`} theme={theme}/>)
                })}
            </tbody>
        </StyledEvalTable>
    )
}

const EvalRow = ({ event, attendences, instruments, theme }) => {
    const [attendingInstruments, setAttendingInstruments] = useState({})
    const [probAttendingInstruments, setProbAttendingInstruments] = useState({})

    const getInstruments = (attendences, attendence) => {
        let _instruments = {}
        let _attendences = []
        if (attendence === -1)
            _attendences = attendences?.filter(att => att.Attendence === attendence && att.Prediction === 0)
        else
            _attendences = attendences?.filter(att => att.Attendence === attendence)
        
        if (_attendences === undefined)
            return {}

        for(let attendee of _attendences){
            if(attendee.Instrument === ""){
                if (_instruments["Unbekannt"] === undefined){                        
                    _instruments["Unbekannt"] = 1
                } else {
                    _instruments["Unbekannt"]++
                }
                continue
            }

            if (_instruments[attendee.Instrument] === undefined){
                _instruments[attendee.Instrument] = 1
            } else {
                _instruments[attendee.Instrument]++
            }
        }
        return _instruments
    }

    useEffect(() => {
        if (attendences === undefined)
            return
        setProbAttendingInstruments(getInstruments(attendences, -1))
        setAttendingInstruments(getInstruments(attendences, 1))
    }, [attendences])

    return(
        <tr>
            <td><DateField dateprops={event} /></td>
            <td colSpan={event.PlusOne ? 1 : 2}>{event.Consent}</td>
            {event.PlusOne ? <td>+{event.PlusOne}</td> : <></>}
            <td>{event.Refusal}</td>
            <td>{event.Missing}</td>
            <td>{event.Maybe}</td>
            {instruments.map(instrument => {
                let attending, prob, maybe, refused
                attending = attendingInstruments[instrument] ? attendingInstruments[instrument] : 0
                prob = probAttendingInstruments[instrument] ? probAttendingInstruments[instrument] : 0
                return(<td key={instrument}>{attending} ({prob}) {maybe}</td>)
            })}
            <EvalDiagram event={event} theme={theme}/>
        </tr>
    )
}

export default Overview