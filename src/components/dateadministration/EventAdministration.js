import { useState } from "react"
import Overview from "./overview/Overview"
import Button from "../../modules/components/button/Button"
import EventForm from "./eventform/EventForm"
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"

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
        case 'date_button_2':
            setView(2)
            break;
        }
    }
    
    return(
        <>
            {props.auth_level > 1 ? <HeaderMenu>
                <Button id="date_button_0" type="button" onClick={navigate}>Übersicht</Button>
                {props.auth_level > 2 ? <Button id="date_button_1" type="button" onClick={navigate}>Details</Button> : <></>}
            </HeaderMenu> : <></>}
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
        return(<EventForm />)
    }
}

export default EventAdministration