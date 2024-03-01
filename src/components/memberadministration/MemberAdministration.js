import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Button from '../../modules/components/button/Button'
import MemberForm from './memberform/MemberForm'
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import { host } from '../../modules/data/DBConnect'

const Overview =lazy(() => import('./overview/Overview'))

const Memberadministration = (props) => {

    const [view, setView] = useState(0)
    const [members, setMembers] = useState(new Array(0))

    const fetchMembers = useCallback(async () => {
        fetch(`${host}/api/v0/member?api_token=${localStorage.getItem('api_token')}`)
            .then(response => response.json())
            .then(data => {
                setMembers(data)
            })
    }, [])

    useEffect(() => {
        fetchMembers()
    }, [fetchMembers])

    const reload = useCallback(() => {
        fetchMembers()
    }, [fetchMembers])

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
            <View view={view} members={members} reload={reload}/>
        </>
    )
}

const View = ({ view, members, reload}) => {
    switch(view){
    default:
    case 0:
        return(<Suspense fallback={<div>Übersicht lädt</div>}>
            <Overview members={members}/>
        </Suspense>)
    case 1:
        return(<MemberForm members={members} reload={reload}/>)
    }
}

export default Memberadministration