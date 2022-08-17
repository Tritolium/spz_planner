import { useState } from "react"
import Overview from "./overview/Overview"

import EventEditor from "./EventEditor"
import Button from "../../modules/components/button/Button"

const EventAdministration = (props) => {

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
                    <Button id="date_button_0" type="button" onClick={navigate}>Übersicht</Button>
                    {props.auth_level > 2 ? <Button id="date_button_1" type="button" onClick={navigate}>Einzelansicht</Button> : <></>}
                </nav>
            </header>
            <View view={view} />
        </>
    )
}

const View = (props) => {
    switch(props.view){
    default:
    case 0:
        return(<Overview />)
    case 1:
        return(<EventEditor />)
    }
}

export default EventAdministration