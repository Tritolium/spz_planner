import { Suspense } from "react"
import { Table } from "../../../modules/components/overview/Table"
import { StyledOverview } from "./Overview.styled"

const Overview = ({ members }) => {

    return(
        <StyledOverview>
            <MemberList members={members} />
        </StyledOverview>
    )
}

const MemberList = ({ members }) => {
    return(
        <Suspense fallback={<div>Tabelle lädt</div>}>
            <Table>
                <thead>
                    <tr>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Instrument</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => {
                        return(<Member key={`member_${member.Member_ID}`} member={member} />)
                    })}
                </tbody>
            </Table>
        </Suspense>
        
    )
}

const Member = ({ member }) => {
    return(
        <tr>
            <td>{member.Forename}</td>
            <td>{member.Surname}</td>
            <td>{member.Instrument}</td>
        </tr>
    )
}

export default Overview