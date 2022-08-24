import { useEffect } from "react"
import { useCallback, useState } from "react"
import { Table } from "../../../modules/components/overview/Table"
import { getMembers } from "../../../modules/data/DBConnect"
import { StyledOverview } from "./Overview.styled"

const Overview = () => {

    const [members, setMembers] = useState(new Array(0))

    const fetchMembers = useCallback(async () => {
        let _members = await getMembers()
        if(_members !== undefined)
            setMembers(_members)
        else
            setMembers(new Array(0))
    }, [])

    useEffect(() => {
        fetchMembers()
    }, [fetchMembers])

    return(
        <StyledOverview>
            <MemberList members={members} />
        </StyledOverview>
    )
}

const MemberList = ({ members }) => {
    return(
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
                    return(<Member member={member} />)
                })}
            </tbody>
        </Table>
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