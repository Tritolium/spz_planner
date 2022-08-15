import { useState } from 'react'
import Button from '../../modules/components/button/Button'
import './MemberAdministration.css'
import MemberEditor from './MemberEditor'
import MemberForm from './memberform/MemberForm'
import Overview from './Overview'

const Memberadministration = (props) => {

    const [view, setView] = useState(0)

    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'member_button_0':
            setView(0)
            break
        case 'member_button_1':
            setView(1)
            break
        case 'member_button_2':
            setView(2)
            break
        }
    }

    return (
        <>
            <header className="Memberadministration-header">
                <nav>
                    <Button id="member_button_0" type='button' onClick={navigate}>Übersicht</Button>
                    {props.auth_level > 2 ? <Button id='member_button_1' type='button' onClick={navigate}>Stammdaten</Button> : <></>}
                    {/*props.auth_level > 2 ? <Button id="member_button_2" type='button' onClick={navigate}>Einzelansicht</Button> : <></>*/}
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
        return(<MemberForm />)
    case 2:
        return(<MemberEditor />)
    }
}

export default Memberadministration