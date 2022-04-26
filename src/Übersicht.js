import { useEffect, useRef, useState } from "react"

import check from './check.png'
import alert from './alert.png'
import deny from './delete-button.png'

const Übersicht = () => {
    const [abfragen, setAbfragen] = useState(new Array(0))
    const loading = useRef(true)

    useEffect(() => {
        const fetchData = async () => {
            fetch('http://spzroenkhausen.bplaced.net/api/abfrage.php', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/JSON'
                },
            }).then((res) => {
                if(res.status === 200){
                    res.json().then((json) => {
                        setAbfragen(json)
                    })
                }
            })
        }
        if(loading.current) {
            if(process.env.NODE_ENV === 'production'){
                fetchData()
            } else {
                setAbfragen([
                    {
                        Name: "Test",
                        ft_oeling: 1,
                        sf_ennest: 2,
                        timestamp: ""
                    },
                    {
                        Name: "Test",
                        ft_oeling: 2,
                        sf_ennest: 0,
                        timestamp: ""
                    },
                    {
                        Name: "Test",
                        ft_oeling: 0,
                        sf_ennest: 1,
                        timestamp: ""
                    }
                ])
            }
        }
    }, [])
    console.log(abfragen)
    if(abfragen === undefined) {
        console.log('undefined')
        return(<>Noch keine Rückmeldungen</>)
    } else {
        return(
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>FT Oelinghauser Heide<br />15. Mai 2022</th>
                        <th>SF Ennest<br />17. Juli 2022</th>
                    </tr>
                </thead>
                <tbody>
                    {abfragen.map((abfrage) => {
                        return(
                            <AbfragenTableRow abfrage={abfrage}/>
                        )
                    })}
                </tbody>
            </table>
        )
    }
}

const AbfragenTableRow = ({abfrage}) => {
    return(
        <tr className="Abtr">
            <td>{abfrage.Name}</td>
            <td><ZusageIcon id={abfrage.ft_oeling}/></td>
            <td><ZusageIcon id={abfrage.sf_ennest}/></td>
        </tr>
    )
}

const ZusageIcon = ({id}) => {
    switch(id){
    default:
    case 0:
        return(<img src={deny} alt='deny'/>)
    case 1:
        return(<img src={alert} alt='alert'/>)
    case 2:
        return(<img src={check} alt='check'/>)
    }
}

export default Übersicht