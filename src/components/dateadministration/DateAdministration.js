import { useState } from "react"
import Overview from "./Overview"

import './DateAdministration.css'

const DateAdministration = ({api_token}) => {

    const [view, setView] = useState(0)
    
    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'date_button_0':
            setView(0)
            break
        }
    }
    
    return(
        <>
            <header>
                <nav>
                    <button id="date_button_0" type="button" onClick={navigate}>Übersicht</button>
                </nav>
            </header>
            <View view={view} api_token={api_token}/>
        </>
    )
}

const View = (props) => {
    switch(props.view){
    default:
    case 0:
        return(<Overview api_token={props.api_token}/>)
    }
}

export default DateAdministration