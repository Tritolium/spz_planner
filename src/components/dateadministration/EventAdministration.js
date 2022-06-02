import { useState } from "react"
import Overview from "./Overview"

import './EventAdministration.css'
import EventEditor from "./EventEditor"

const EventAdministration = ({api_token}) => {

    const [view, setView] = useState(0)
    
    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'date_button_0':
            setView(0)
            break
        case 'date_button_1':
            setView(1)
            break;
        }
    }
    
    return(
        <>
            <header>
                <nav>
                    <button id="date_button_0" type="button" onClick={navigate}>Übersicht</button>
                    <button id="date_button_1" type="button" onClick={navigate}>Einzelansicht</button>
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
    case 1:
        return(<EventEditor />)
    }
}

export default EventAdministration