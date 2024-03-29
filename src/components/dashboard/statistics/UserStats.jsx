import { StyledUserStats } from "./UserStats.styled"

const UserStats = ({ users }) => {

    if (!users) return <></>
    
    return (<StyledUserStats>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Nutzer</th>
                    <th>Aufrufe</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Heute</td>
                    <td>{users?.Today?.Daily}</td>
                    <td>{users?.Today?.Calls}</td>
                </tr>
                <tr>
                    <td>Gestern</td>
                    <td>{users?.Yesterday?.Daily}</td>
                    <td>{users?.Yesterday?.Calls}</td>
                </tr>
                <tr>
                    <td>7 Tage</td>
                    <td>{users?.Seven?.Daily}</td>
                    <td>{users?.Seven?.Calls}</td>
                </tr>
                <tr>
                    <td>30 Tage</td>
                    <td>{users?.Thirty?.Daily}</td>
                    <td>{users?.Thirty?.Calls}</td>
                </tr>
            </tbody>
        </table>
        {users?.Today?.Users ? <table>
            <thead>
                <tr>
                    <th>Zeitstempel</th>
                    <th>Nutzer</th>
                </tr>
            </thead>
            <tbody>
                {users?.Today?.Users?.map((user, index) => {
                    return <tr key={index}>
                        <td>{user.Timestamp.split(" ")[1]}</td>
                        <td>{user.Fullname}</td>
                    </tr>
                })}
            </tbody>
        </table> : <></>}
    </StyledUserStats>)
}

export default UserStats