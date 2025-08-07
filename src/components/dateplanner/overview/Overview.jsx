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
import { rateEvent } from "../../../modules/helper/Interpreter"

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
        let _attendences = await getAllAttendences(selectedUsergroup_ID)
        setAttendences(_attendences)
    }, [selectedUsergroup_ID])

    const fetchEval = useCallback(async () => {
        let _eval = await getEvalByUsergroup(selectedUsergroup_ID)
        setEvaluation(_eval)
    }, [selectedUsergroup_ID])

    const onUsergroupChange = useCallback((e) => {
        setSelectedUsergroup_ID(e.target.value)
    }, [setSelectedUsergroup_ID])

    const reload = useCallback(async (background = false) => {
        if(!background)
            setLoading(true)
        await fetchAttendences()
        await fetchEval()
        if(!background)
            setLoading(false)
    }, [fetchAttendences, fetchEval])

    useEffect(() => {
        reload()
    }, [reload])

    useEffect(() => {
        fetchUsergroups()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            reload(true)
        }, 10000)
        return () => clearInterval(interval)
    }, [reload])

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

export const Zusage = ({attendence, plusone, theme, prediction, credible}) => {
    if(attendence === 1 && plusone === 1)
        return(<PlusOne theme={theme} className="PlusOneIcon"/>)
    switch(attendence){
    default:
    case -1:
        return(<Blank theme={theme} overlay={prediction}/>)
    case 0:
        return(<Deny theme={theme}/>)
    case 1:
        return(<Check theme={theme} credible={credible}/>)
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
                    <th className="Header">Termin</th>
                    <th className="Header" colSpan={2}>Zu.</th>
                    {instruments.map(instrument => {
                        return(<th className="Header" key={instrument}>{abbreviate(instrument)}</th>)
                    })}
                </tr>
            </thead>
            <tbody>
                {evaluation.map(event => {
                    let _event = attendences.find(att => att.Event_ID === event.Event_ID)
                    let _attendences = _event?.Attendences
                    event.Category = _event?.Category
                    return(<EvalRow event={event} attendences={_attendences} instruments={instruments} key={`eval_${event.Event_ID}`} theme={theme}/>)
                })}
            </tbody>
        </StyledEvalTable>
    )
}

const EvalRow = ({ event, attendences, instruments, theme }) => {
    const [attendingInstruments, setAttendingInstruments] = useState({})
    const [probAttendingInstruments, setProbAttendingInstruments] = useState({})
    const [maybeAttendingInstruments, setMaybeAttendingInstruments] = useState({})
    
    const [rating, setRating] = useState("")

    // TODO: get ratingTerm from DB
    const ratingTermEvent = "(Becken > 0 && Pauke > 0 || Becken > 0 && Schlagwerk > 0 || Pauke > 0 && Schlagwerk > 0 || Schlagwerk >= 2)" +
        " && Sopran >=4 && Trommel >= 2 && Major >= 1"
    
    const ratingTermPractice = "(Becken > 0 && Pauke > 0 || Becken > 0 && Schlagwerk > 0 || Pauke > 0 && Schlagwerk > 0 || Schlagwerk >= 1)" +
        " && Sopran >=2 && Trommel >= 1 && Major >= 1"

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
        let attending, prob, maybe, rating
        let ratingTerm = ""

        if (attendences === undefined || event?.Category === "other")
            return

        switch (event.Category) {
        case "event":
            ratingTerm = ratingTermEvent
            break
        case "practice":
            ratingTerm = ratingTermPractice
            break
        default:
            break
        }

        console.log(event.Category)

        attending = getInstruments(attendences, 1)
        prob = getInstruments(attendences, -1)
        maybe = getInstruments(attendences, 2)

        setAttendingInstruments(attending)
        setProbAttendingInstruments(prob)
        setMaybeAttendingInstruments(maybe)
        rating = rateEvent(attending, prob, maybe, ratingTerm)
        switch (rating) {
        case 3:
            setRating("okay")
            break
        case 2:
            setRating("prob")
            break
        case 1:
            setRating("warning")
            break
        default:
            setRating("critical")
            break
        }
    }, [attendences, event])

    return(
        <tr>
            <td><DateField dateprops={event} /></td>
            <td colSpan={event.PlusOne ? 1 : 2}>{event.Consent}</td>
            {event.PlusOne ? <td>+{event.PlusOne}</td> : <></>}
            {instruments.map(instrument => {
                let attending, prob, maybe
                attending = attendingInstruments[instrument] ? attendingInstruments[instrument] : 0
                prob = probAttendingInstruments[instrument] ? probAttendingInstruments[instrument] : 0
                maybe = maybeAttendingInstruments[instrument] ? maybeAttendingInstruments[instrument] : 0
                return(<InstrumentEvalTD className={rating} key={instrument} attending={attending} prob={prob} maybe={maybe}/>)
            })}
            <EvalDiagram event={event} theme={theme}/>
        </tr>
    )
}

const InstrumentEvalTD = ({ className, attending, prob, maybe}) => {
    let inner = ""

    if(attending > 0)
        inner += attending
    if(prob > 0)
        inner += ` (${prob})`
    if(maybe > 0)
        inner += ` [${maybe}]`

    return(<td className={className}>{inner}</td>)
}

const abbreviate = (string) => {
    const abbreviations = {
        "Alt": "A",
        "Ausbildung": "Ausb",
        "Becken": "B",
        "Lyra": "L",
        "Major": "M",
        "Pauke": "P",
        "Schlagwerk": "SW",
        "Sopran": "S",
        "Tenor": "T",
        "Trommel": "Tr"
    }

    return abbreviations[string] ? abbreviations[string] : string
}

export default Overview