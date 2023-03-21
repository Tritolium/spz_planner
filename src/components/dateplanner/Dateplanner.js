import { lazy, Suspense, useState } from 'react'

import './Dateplanner.css'
import UnstyledAbsenceInput from './absenceInput/AbsenceInput'
import styled from 'styled-components'
import Button from '../../modules/components/button/Button'
import HeaderMenu from '../../modules/components/headermenu/HeaderMenu'

const AttendenceInput = lazy(() => import('./attendenceInput/Termineingabe'))
const Overview = lazy(() => import('./overview/Overview'))

const dates = [
    {
        Type: "FT",
        Location: "Oelinghauserheide",
        Date: "14. Mai 2022",
        Day_of_Week: "Samstag"
    },
    {
        Type: "SF",
        Location: "Ennest",
        Date: "17. Juli 2022",
        Day_of_Week: "Sonntag"
    }
]

const Dateplanner = (props) => {

    const [view, setView] = useState(0)

    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'date_button_0':
            setView(0)
            break
        case 'date_button_1':
            setView(1)
            break
        case 'date_button_2':
            setView(2)
            break
        }
    }

    return (
        <>
            <HeaderMenu>
                <Button id='date_button_0' font_size={'1rem'} onClick={navigate}>Eingabe</Button>
                {props.auth_level > 1 ? <Button id='date_button_1' font_size={'1rem'} onClick={navigate}>Übersicht</Button> : <></>}
                {props.auth_level > 2 ? <Button id='date_button_2' font_size={'1rem'} onClick={navigate}>manuelle Eingabe</Button> : <></>}
            </HeaderMenu>
            <View view={view} fullname={props.fullname}/>
        </>
    )
}

const AbsenceInput = styled(UnstyledAbsenceInput)`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;

    @media screen and (max-width: 720px) {
        flex-direction: column;
        > select {
            width: 100%
        }
    }

    > select {
        max-height: 40px;
        padding: 5px;
        margin: 5px;
    }
    > img {
        padding: 2px;
        min-height: 21px;
        height: 10vh;
        max-height: 64px;
    }
`

const View = (props) => {
    switch(props.view){
    default:
    case 0:
        return(<Suspense>
            <AttendenceInput dates={dates} fullname={props.fullname}/>
        </Suspense>)
    case 1:
        return(<Overview dates={dates}/>)
    case 2:
        return(<AbsenceInput />)
    }
}

export default Dateplanner