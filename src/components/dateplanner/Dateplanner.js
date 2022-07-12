import check from './check.png'
import deny from './delete-button.png'
import alert from './alert.png'
import Termineingabe from './Termineingabe'
import Overview from './Overview'
import { useState } from 'react'

import './Dateplanner.css'

const dates = [
    {
        Type: "FT",
        Location: "Oelinghauserheide",
        Date: "14. Mai 2022",
        Day_of_Week: "Samstag"
    },
    {
        Type: "SF",
        Location: "Ennest",
        Date: "17. Juli 2022",
        Day_of_Week: "Sonntag"
    }
]

const Dateplanner = (props) => {

    const [view, setView] = useState(0)

    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'date_button_0':
            setView(0)
            break
        case 'date_button_1':
            setView(1)
            break
        }
    }

    return (
        <>
            <header className="Dateplanner-header">
                <div><img src={check} alt='Zusage'/> Zusage</div>
                <div><img src={deny} alt='Absage'/> Absage</div>
                <div visible="false"><img src={alert} alt='Unsicher'/> Unsicher</div>
                <nav>
                    <button id='date_button_0' onClick={navigate}>Eingabe</button>
                    {props.auth_level > 1 ? <button id='date_button_1' onClick={navigate}>Übersicht</button> : <></>}
                </nav>
            </header>
            <View view={view} fullname={props.fullname}/>
        </>
    )
}

const View = (props) => {
    switch(props.view){
    default:
    case 0:
        return(<Termineingabe dates={dates} fullname={props.fullname}/>)
    case 1:
        return(<Overview dates={dates}/>)
    }
}

export default Dateplanner