import { StyledUserStats } from "./UserStats.styled"

const UserStats = ({ users }) => {

    return (<StyledUserStats>
        <table>
            <thead>
                <tr>
                    <th>Nutzer heute</th>
                    <th>Aufrufe</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{users?.Daily}</td>
                    <td>{users?.Calls}</td>
                </tr>
            </tbody>
        </table>
    </StyledUserStats>)
}

export default UserStats