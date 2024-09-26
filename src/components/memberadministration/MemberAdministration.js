import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Button from '../../modules/components/button/Button'
import MemberForm from './memberform/MemberForm'
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import { host } from '../../modules/data/DBConnect'
import { hasPermission } from '../../modules/helper/Permissions'

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
        let button_id = e.target.id.split('_')[2]
        setView(parseInt(button_id))
    }

    const buttons = [
        { id: 'member_button_0', label: 'Übersicht', permitted: hasPermission(1), onClick: navigate },
        { id: 'member_button_1', label: 'Stammdaten', permitted: hasPermission(2), onClick: navigate }
    ]

    return (
        <>
            <HeaderMenu>
                {buttons.map(({ id, label, permitted, onClick }) => {
                    return (
                        permitted && (
                            <Button key={id} type='button' id={id} onClick={onClick}>
                                {label}
                            </Button>
                        )
                    )
                })}
            </HeaderMenu>
            <View view={view} members={members} reload={reload}/>
        </>
    )
}

const View = ({ view, members, reload}) => {

    const components = {
        '0': <Overview members={members}/>,
        '1': <MemberForm members={members} reload={reload}/>
    }

    const fallbacks = {
        '0': <div>Übersicht lädt</div>,
        '1': <div>Stammdaten laden</div>
    }

    return (
        <Suspense fallback={fallbacks[view]}>
            {components[view]}
        </Suspense>
    )
}

export default Memberadministration