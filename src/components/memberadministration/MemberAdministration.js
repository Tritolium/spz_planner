import { useState } from 'react'
import Button from '../../modules/components/button/Button'
import MemberForm from './memberform/MemberForm'
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import Overview from './overview/Overview'

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
        }
    }

    return (
        <>
            <HeaderMenu>
                <Button id="member_button_0" type='button' onClick={navigate}>Übersicht</Button>
                {props.auth_level > 2 ? <Button id='member_button_1' type='button' onClick={navigate}>Stammdaten</Button> : <></>}
            </HeaderMenu>
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
    }
}

export default Memberadministration