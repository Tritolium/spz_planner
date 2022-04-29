import { useState } from "react"
import Overview from "./Overview"

const DateAdministration = () => {

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
            <View view={view}/>
        </>
    )
}

const View = (props) => {
    switch(props.view){
    default:
    case 0:
        return(<Overview />)
    }
}

export default DateAdministration