import { lazy, Suspense, useState } from 'react'

import './Dateplanner.css'
import Button from '../../modules/components/button/Button'
import HeaderMenu from '../../modules/components/headermenu/HeaderMenu'
import AbsenceInput from './absenceInput/AbsenceInput'

const AttendenceInput = lazy(() => import('./attendenceInput/Termineingabe'))
const Overview = lazy(() => import('./overview/Overview'))

const Dateplanner = (props) => {

    const [view, setView] = useState(0)

    const navigate = (e) => {
        let button_id = e.target.id.split('_')[2]
        setView(parseInt(button_id))
    }

    const buttons = [
        { id: 'date_button_0', label: "Eingabe", permitted: true },
        { id: 'date_button_1', label: "Übersicht", permitted: props.auth_level > 1},
        { id: 'date_button_2', label: "manuelle Eingabe", permitted: props.auth_level > 2 }
    ]

    return (
        <>
            <HeaderMenu>
                {buttons.map(({ id, label, permitted }) => {
                    return (
                        permitted && (
                            <Button key={id} type='button' id={id} onClick={navigate}>
                                {label}
                            </Button>
                        )
                    )
                })}
            </HeaderMenu>
            <View view={view} fullname={props.fullname} theme={props.theme}/>
        </>
    )
}

const View = (props) => {

    const components = {
        '0': <AttendenceInput fullname={props.fullname} theme={props.theme}/>,
        '1': <Overview theme={props.theme}/>,
        '2': <AbsenceInput theme={props.theme}/>
    }

    return (
        <Suspense fallback={<div>Lädt...</div>}>
            {components[props.view]}
        </Suspense>
    )
}

export default Dateplanner