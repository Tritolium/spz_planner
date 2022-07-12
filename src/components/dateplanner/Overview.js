import { useEffect, /*useRef,*/ useState } from "react"
import styled from "styled-components"

import { getAttendences } from '../../modules/data/DBConnect'

import check from './check.png'
import deny from './delete-button.png'
import blank from './blank.png'

//import check from './check.png'
//import alert from './alert.png'
//import deny from './delete-button.png'
//import DateField from "./DateField"

const Overview = ({dates}) => {
    //const [abfragen, setAbfragen] = useState(new Array(0))
    const [attendences, setAttendences] = useState(new Array(0))
    //const loading = useRef(true)

    useEffect(() => {
        const fetchAttendences = async () => {
            let _attendences = await getAttendences(true)
            setAttendences(_attendences)
        }
        fetchAttendences()
    }, [])
    if(attendences.length === 0){
        return(<></>)
    } else {
        return(
            <Table>
                <thead>
                    <th>Termin:</th>
                    {attendences[0].Attendences.map((att) => {
                        return(<TableHeaderField><div><span>{att.Fullname}</span></div></TableHeaderField>)
                    })}
                </thead>
                <tbody>
                    {
                        attendences.map(event => {
                            return(
                                <tr>
                                    <TableDataField>{event.EventName}</TableDataField>
                                    {event.Attendences.map(attendence => {
                                        return(<TableDataField><Zusage attendence={attendence.Attendence} /></TableDataField>)
                                    })}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        )
    }
}

const Table = styled.table`
    border-collapse: collapse;
`

const TableHeaderField = styled.th`
    height: 140px;
    white-space: nowrap;

    > div {
        transform:
            translate(14px, 50px)
            rotate(315deg);
        width: 30px;
    }
    > div > span {
        border-bottom: 1px solid #ccc;
        padding: 5px 10px;
    }
`

const TableDataField = styled.td`
    border: 1px solid #ccc;
    > img {
        width: 30px;
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
    }
}

/*
const AbfragenTableRow = ({abfrage}) => {
    return(
        <tr className="Abtr">
            <td>{abfrage.Name}</td>
            <td><ZusageIcon id={abfrage.ft_oeling}/></td>
            <td><ZusageIcon id={abfrage.sf_ennest}/></td>
        </tr>
    )
}*/
/*
const ZusageIcon = ({id}) => {
    switch(id){
    default:
    case 0:
        return(<img src={deny} alt='deny'/>)
    case 1:
        return(<img src={check} alt='check'/>)
    case 2:
        return(<img src={alert} alt='alert'/>)
    }
}*/

export default Overview