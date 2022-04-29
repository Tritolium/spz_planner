import { useState } from 'react'
import './MemberAdministration.css'
import Overview from './Overview'

const Memberadministration = () => {

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
            <View view={view} />
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

export default Memberadministration