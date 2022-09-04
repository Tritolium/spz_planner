import { StyledTable } from "../overview/Overview.styled"
import { StyledCompleteOverview } from "./CompleteOverview.styled"

const CompleteOverview = () => {
    return(
        <StyledCompleteOverview>
            <Table />
        </StyledCompleteOverview>
    )
}

const Table = () => {
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
        </StyledTable>
    )
}

export default CompleteOverview