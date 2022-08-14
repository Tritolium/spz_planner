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

    return(
        <StyledTable>
            <thead>
                <tr>
                    <th>von</th>
                    <th>bis</th>
                    <th>Bemerkung</th>
                </tr>
            </thead>
            <tbody>
                {absences.map(absence => {
                    return(
                        <tr>
                            <td>{absence.From}</td>
                            <td>{absence.Until}</td>
                            <td>{absence.Info}</td>
                        </tr>
                    )
                })}
            </tbody>
        </StyledTable>
    )
}

export default Overview