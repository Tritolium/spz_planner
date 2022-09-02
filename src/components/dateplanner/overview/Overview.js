import { useEffect, useState } from "react"

import { getAttendences, getEval, getMissingFeedback } from '../../../modules/data/DBConnect'

import check from '../check.png'
import deny from '../delete-button.png'
import blank from '../blank.png'
import alert from '../alert.png'

import DateField from "../attendenceInput/DateField"
import { StyledEvalTable, StyledOverview, StyledOverviewTable } from "./Overview.styled"
import EvalDiagram from "./EvalDiagram"

const Overview = () => {
    const [attendences, setAttendences] = useState(new Array(0))
    const [evaluation, setEvaluation] = useState(new Array(0))
    const [missingFeedback, setMissingFeedback] = useState(new Array(0))

    const fetchAttendences = async () => {
        let _attendences = await getAttendences(true)
        setAttendences(_attendences)
    }

    const fetchMissingFeedback = async () => {
        let _missingFeedback = await getMissingFeedback()
        setMissingFeedback(_missingFeedback)
    }

    const fetchEval = async () => {
        let _eval = await getEval()
        setEvaluation(_eval)
    }

    useEffect(() => {
        fetchAttendences()
        fetchEval()
        fetchMissingFeedback()
    }, [])

    if(attendences.length === 0){
        return(<></>)
    } else {
        return(
            <StyledOverview>
                <OverviewTable attendences={attendences}/>
                <EvalTable evaluation={evaluation}/>
            Fehlende Rückmeldungen:
            {missingFeedback.map(missing => {
                return(<div>{missing.Forename} {missing.Surname}</div>)
            })}
            </StyledOverview>
        )
    }
}

const Zusage = ({attendence}) => {
    switch(attendence){
    default:
    case -1:
        return(<img src={blank} alt="blank"></img>)
    case 0:
        return(<img src={deny} alt="deny"></img>)
    case 1:
        return(<img src={check} alt="check"></img>)
    case 2:
        return(<img src={alert} alt="alert"></img>)
    }
}

const OverviewTable = ({attendences}) => {
    return(
        <StyledOverviewTable>
            <thead>
                <th>Termin:</th>
                {attendences[0].Attendences.map((att) => {
                    return(<th>{att.Fullname.split(' ')[0].slice(0, 2)}{att.Fullname.split(' ')[1][0]}</th>)
                })}
            </thead>
            <tbody>
                {
                    attendences.map(event => {
                        return(
                            <tr>
                                <td><DateField dateprops={event}/></td>
                                {event.Attendences.map(attendence => {
                                    return(<td><Zusage attendence={attendence.Attendence} /></td>)
                                })}
                            </tr>
                        )
                    })
                }
            </tbody>
            </StyledOverviewTable>
    )
}

const EvalTable = ({evaluation}) => {
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
                    return(<EvalRow event={event} />)
                })}
            </tbody>
        </StyledEvalTable>
    )
}

const EvalRow = ({ event }) => {
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
            <EvalDiagram event={event}/>
        </tr>
    )
}

export default Overview