import { useEffect, useState } from "react"

const Overview = () => {

    const [member, setMember] = useState(new Array(0))

    useEffect(() => {
        const fetchData = async () => {
            fetch('http://spzroenkhausen.bplaced.net/api/member.php', {
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
                },
                {
                    Forename: "Erika",
                    Surname: "Musterfrau"
                }
            ])
        }
    }, [])

    return(
        <table>
            <thead>
                <tr>
                    <th>Vorname</th>
                    <th>Nachname</th>
                </tr>
            </thead>
            <tbody>
                {member.map((mem) => {
                    return(
                        <tr key={mem.Forename+mem.Surname}>
                            <td>{mem.Forename}</td>
                            <td>{mem.Surname}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Overview