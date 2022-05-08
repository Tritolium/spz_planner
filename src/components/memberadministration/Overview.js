import { useEffect, useState } from "react"

const Overview = (props) => {

    const [member, setMember] = useState(new Array(0))

    useEffect(() => {
        const fetchData = async () => {
            fetch('http://spzroenkhausen.bplaced.net/api/member.php?api_token=' + props.api_token, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/JSON'
                }
            }).then((res) => {
                if(res.status === 200){
                    res.json().then((json) => {
                        setMember(json)
                    })
                }
            })
        }
        if(process.env.NODE_ENV === 'production'){
            fetchData()
        } else {
            setMember([
                {
                    Forename: "Max",
                    Surname: "Mustermann",
                    Auth_level: 0
                },
                {
                    Forename: "Erika",
                    Surname: "Musterfrau",
                    Auth_level: 1
                }
            ])
        }
    }, [props.api_token])

    const edit = (id) => {
        
    }

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
                        <tr key={mem.Forename+mem.Surname} onDoubleClick={edit(mem.id)}>
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