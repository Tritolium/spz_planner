import { useEffect, /*useRef,*/ useState } from "react"
import styled from "styled-components"

import { getAttendences } from '../../../modules/data/DBConnect'

import check from '../check.png'
import deny from '../delete-button.png'
import blank from '../blank.png'
import alert from '../alert.png'

import DateField from "../attendenceInput/DateField"

const Overview = () => {
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
            </Table>
        )
    }
}

const Table = styled.table`
    border-collapse: collapse;
    position: relative;
    overflow: scroll;
    align-self: flex-start;
    margin: 0 2px 0 2px;
`

const TableHeaderFieldT = styled.th`
    position: absolute;
    top: 120px;
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