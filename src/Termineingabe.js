import { useCallback, useState } from 'react'
import Terminzusage from './Terminzusage'

const Termineingabe = () => {

    const [name, setName] = useState("")
    const [ft, setFt] = useState(1)
    const [sf, setSf] = useState(1)

    const clickFt = useCallback(() => {
        setFt((ft + 1) % 3)
    }, [ft])

    const clickSf = useCallback(() => {
        setSf((sf + 1) % 3)
    }, [sf])

    const onNameChange = useCallback((e) => {
        setName(e.target.value)
    }, [])

    const sendForm = (e) => {
        e.preventDefault()
        fetch("/api/abfrage.php", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"name": name, "ft_oeling": ft, "sf_ennest": sf})
        }).then((res) => {
            switch(res.status){
            case 201:
                alert("erfolgreich gesendet")
                setFt(1)
                setSf(1)
                break
            default:
            case 404:
                alert("Server nicht erreicht")
                break
            }
            
        })
    }

    return(
        <form onSubmit={sendForm} className="Main">
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <th>FT Oelinghauser Heide<br />15. Mai 2022</th>
                        <th>SF Ennest<br />17. Juli 2022</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><Nameneingabe onChange={onNameChange}/></td>
                        <td className='Tz'><Terminzusage onClick={clickFt} attendence={ft}/></td>
                        <td className='Tz'><Terminzusage onClick={clickSf} attendence={sf}/></td>
                    </tr>
                </tbody>
            </table>
            <button type='submit'>Abschicken</button>
        </form>
    )
}

const Nameneingabe = (props) => {
    return(
        <input type="text" onChange={props.onChange}/>
    )
}

export default Termineingabe