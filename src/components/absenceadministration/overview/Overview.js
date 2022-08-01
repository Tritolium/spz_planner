import { useEffect } from "react"
import { useState } from "react"
import { getOwnAbsences } from "../../../modules/data/DBConnect"
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
            let _absences = await getOwnAbsences()
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
                            <td>{absence.from}</td>
                            <td>{absence.until}</td>
                            <td>{absence.info}</td>
                        </tr>
                    )
                })}
            </tbody>
        </StyledTable>
    )
}

export default Overview