import { useEffect } from "react"
import { useState } from "react"
import { getAbsences } from "../../../modules/data/DBConnect"
import { StyledOverview, StyledTable } from "./Overview.styled"

const Overview = () => {
    return(
        <StyledOverview>
            <Table />
        </StyledOverview>
    )
}

const Table = () => {

    const [absences, setAbsences] = useState(new Array(0))

    useEffect(() => {
        const fetchAbsences = async () => {
            let _absences = await getAbsences('current')
            if(_absences !== undefined)
                setAbsences(_absences)
        }
        fetchAbsences()
    }, [])

    const formatDate = (date) => {
        date = date.split('-')
        return `${date[2]}.${date[1]}.${date[0]}`
    } 

    return(
        <StyledTable>
            {absences.length > 0 ? <thead>
                <tr>
                    <th>von</th>
                    <th>bis</th>
                    <th>Bemerkung</th>
                </tr>
            </thead> : <thead><tr><th>Keine Abwesenheiten eingetragen</th></tr></thead>}
            <tbody>
                {absences.map(absence => {
                    return(
                        <tr key={absence.Absence_ID}>
                            <td>{formatDate(absence.From)}</td>
                            <td>{formatDate(absence.Until)}</td>
                            <td>{absence.Info}</td>
                        </tr>
                    )
                })}
            </tbody>
        </StyledTable>
    )
}

export default Overview