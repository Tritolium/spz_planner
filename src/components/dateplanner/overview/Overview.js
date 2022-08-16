import { useEffect, /*useRef,*/ useState } from "react"
import styled from "styled-components"

import { getAttendences, getEval, getMissingFeedback } from '../../../modules/data/DBConnect'

import check from '../check.png'
import deny from '../delete-button.png'
import blank from '../blank.png'
import alert from '../alert.png'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'

import DateField from "../attendenceInput/DateField"
import { Bar } from "react-chartjs-2"
import { StyledOverview } from "./Overview.styled"

const Overview = () => {
    const [attendences, setAttendences] = useState(new Array(0))
    const [evaluation, setEvaluation] = useState(new Array(0))
    const [missingFeedback, setMissingFeedback] = useState(new Array(0))

    useEffect(() => {
        const fetchAttendences = async () => {
            let _attendences = await getAttendences(true)
            setAttendences(_attendences)
        }
        fetchAttendences()
    }, [])

    useEffect(() => {
        const fetchMissingFeedback = async () => {
            let _missingFeedback = await getMissingFeedback()
            setMissingFeedback(_missingFeedback)
        }
        fetchMissingFeedback()
    }, [])

    useEffect(() => {
        const fetchEval = async () => {
            let _eval = await getEval()
            setEvaluation(_eval)
        }
        fetchEval()
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

const TableHeaderFieldT = styled.th`
    position: absolute;
    top: 120px;
`

const TableRow = styled.tr`
    max-height: 100px;
`

const TableHeaderField = styled.th`
    @media screen and (max-width: 600px) {
        font-size: xx-small;
    }
    @media screen and (max-width: 800px) {
        font-size: x-small;
    }
    @media screen and (max-width: 1000px) {
        font-size: smaller;
    }

    height: 140px;
    white-space: nowrap;
    
    > div {
        transform:
            translate(-4px, 39px)
            rotate(45deg);
        max-width: 30px;
        position: relative;   
    }
    > div > span {
        border-bottom: 1px solid #ccc;
        padding: 5px 2px;
        position: absolute;
        right: 0px;
    }
`

const TableDataField = styled.td`
    @media screen and (max-width: 600px) {
        font-size: xx-small;
    }
    @media screen and (max-width: 800px) {
        font-size: x-small;
    }
    @media screen and (max-width: 1000px) {
        font-size: smaller;
    }

    text-align: center;
    border: 1px solid #ccc;

    > img {
        min-width: 15px;
        width: 100%;
        max-width: 30px;
    }
`

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

const StyledOverviewTable = styled.table`
    border-collapse: collapse;
    position: relative;
    overflow: scroll;
    align-self: flex-start;
    margin: 0 2px 0 2px;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: none;
    }
`

const StyledEvalTable = styled.table`
    border-collapse: collapse;
    position: relative;
    margin: 0 2px 0 2px;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        thead, td {
            display: none;
        }
    }
`

const StyledEvalDiagram = styled.div`
    @media (min-width: ${({theme}) => theme.mobile}) {
        div {
            display: none;
        }
    }
`

const OverviewTable = ({attendences}) => {
    return(
        <StyledOverviewTable>
            <thead>
                <TableHeaderFieldT>Termin:</TableHeaderFieldT>
                {attendences[0].Attendences.map((att) => {
                    return(<TableHeaderField><div><span>{att.Fullname}</span></div></TableHeaderField>)
                })}
            </thead>
            <tbody>
                {
                    attendences.map(event => {
                        return(
                            <tr>
                                <TableDataField><DateField dateprops={event}/></TableDataField>
                                {event.Attendences.map(attendence => {
                                    return(<TableDataField><Zusage attendence={attendence.Attendence} /></TableDataField>)
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
                    <th>Termin:</th>
                    <th>Zusage</th>
                    <th>Absage</th>
                    <th>Ausstehend</th>
                    <th>Vielleicht/Absprache</th>
                </thead>
                <tbody>
                    {
                        evaluation.map(event => {
                            return(
                                <TableRow>
                                    <TableDataField><DateField dateprops={event} /></TableDataField>
                                    <TableDataField>{event.Consent}</TableDataField>
                                    <TableDataField>{event.Refusal}</TableDataField>
                                    <TableDataField>{event.Missing}</TableDataField>
                                    <TableDataField>{event.Maybe}</TableDataField>
                                    <EvalDiagram event={event}/>
                                </TableRow>
                            )
                        })
                    }
                </tbody>
        </StyledEvalTable>
    )
}

const EvalDiagram = ({event}) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      )

    const options = {
        indexAxis: 'y',
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false
          }
        },
        responsive: false,
        scales: {
          x: {
            stacked: true,
            display: false
          },
          y: {
            stacked: true,
          },
        },
      };

    const labels = ['']

    const data = {
        labels,
        datasets: [
            {
                data: [event.Consent],
                backgroundColor: 'rgb(0, 186, 0)'
            },
            {
                data: [event.Refusal],
                backgroundColor: 'rgb(255, 0, 0)'
            },
            {
                data: [event.Missing],
                backgroundColor: 'rgb(37, 183, 211)'
            },
            {
                data: [event.Maybe],
                backgroundColor: 'rgb(255, 161, 31)'
            }
        ],
    }

    return(
        <StyledEvalDiagram>
            <DateField dateprops={event}/>
            <Bar height={"60px"} options={options} data={data} />
        </StyledEvalDiagram>
    )
}

export default Overview