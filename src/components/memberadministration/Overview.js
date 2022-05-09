import { useEffect, useState } from "react"
import { getMembers } from "../../modules/data/DBConnect"

const Overview = (props) => {

    const [member, setMember] = useState(new Array(0))

    useEffect(() => {
        const fetchData = async () => {
            let _members = await getMembers()
            setMember(_members)
        }
        fetchData()
    }, [])

    return(
        <table>
            <thead>
                <tr>
                    <th>Vorname</th>
                    <th>Nachname</th>
                    <th>Level</th>
                </tr>
            </thead>
            <tbody>
                {member.map((mem) => {
                    return(
                        <tr key={mem.Forename+mem.Surname}>
                            <td>{mem.Forename}</td>
                            <td>{mem.Surname}</td>
                            <td>{mem.Auth_level}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Overview