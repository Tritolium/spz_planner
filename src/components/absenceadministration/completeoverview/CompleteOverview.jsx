import { useCallback, useEffect } from "react"
import { useState } from "react"
import { getAllAbsences } from "../../../modules/data/DBConnect"
import { StyledTable } from "../../dateadministration/overview/Overview.styled"
import { StyledCompleteOverview } from "./CompleteOverview.styled"

const CompleteOverview = () => {
    return(
        <StyledCompleteOverview>
            <Table />
        </StyledCompleteOverview>
    )
}

const Table = () => {

    const [absences, setAbsences] = useState(new Array(0))

    const fetchAbsences = useCallback(async () => {
        let _absences = await getAllAbsences('current')
        if(_absences !== undefined)
            setAbsences(_absences)
    }, [])

    const formatDate = (date) => {
        date = date.split('-')
        return `${date[2]}.${date[1]}.${date[0]}`
    }

    useEffect(() => {
        fetchAbsences()
    }, [fetchAbsences])

    return(
        <StyledTable >
           <thead>
                <tr>
                    <th>Name</th>
                    <th>von</th>
                    <th>bis</th>
                    <th>Bemerkung</th>
                </tr>
           </thead>
           <tbody>
                {absences.map(absence => {
                    return(
                        <tr key={absence.Fullname + absence.From}>
                            <td>{absence.Fullname}</td>
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

export default CompleteOverview