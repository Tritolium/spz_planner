import { useState } from 'react'
import './MemberAdministration.css'
import Overview from './Overview'

const Memberadministration = ({api_token}) => {

    const [view, setView] = useState(0)

    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'member_button_0':
            setView(0)
            break
        }
    }

    return (
        <>
            <header className="Memberadministration-header">
                <nav>
                    <button id="member_button_0" type='button' onClick={navigate}>Übersicht</button>
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

export default Memberadministration