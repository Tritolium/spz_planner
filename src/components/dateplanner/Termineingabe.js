import { useCallback, useState } from 'react'
import DateField from './DateField'
import Terminzusage from './Terminzusage'

const Termineingabe = ({dates}) => {

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
            case 400:
                alert("Bitte Namen eintragen und erneut abschicken")
                break
            default:
            case 404:
                alert("Server nicht erreicht")
                break
            }
            
        })
    }

    return(
        <form onSubmit={sendForm} className="DateInput">
            <table>
                <thead>
                    <tr>
                        <td id='date_name_label'>Name:</td>
                        {dates.map(date => {
                            return(<th key={date.Location}><DateField dateprops={date} /></th>)
                        })}
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