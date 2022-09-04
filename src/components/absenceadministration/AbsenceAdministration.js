import React, { useState } from 'react'
import Button from '../../modules/components/button/Button'
import Overview from './overview/Overview';
import { StyledAbsenceAdministration, StyledView } from './AbsenceAdministration.styled'
import AbsenceForm from './absenceform/AbsenceForm';
import HeaderMenu from '../../modules/components/headermenu/HeaderMenu'
import CompleteOverview from './completeoverview/CompleteOverview';

const AbsenceAdministration = ({ auth_level }) => {

    const [view, setView] = useState(0);

    const navigate = (e) => {
        switch(e.target.id){
        default:
        case 'absence_button_0':
            setView(0)
            break
        case 'absence_button_1':
            setView(1)
            break;
        case 'absence_button_2':
            setView(2)
            break;
        }
    }

    return(
        <StyledAbsenceAdministration>
            <HeaderMenu>
                <Button id="absence_button_0" onClick={navigate}>Übersicht</Button>
                <Button id="absence_button_1" onClick={navigate}>Eingabe</Button>
                {auth_level > 2 ? <Button id="absence_button_2" onClick={navigate}>Gesamtübersicht</Button> : <></>}
            </HeaderMenu>
            <View view={view}/>
        </StyledAbsenceAdministration>
    )
}

const View = ({ view }) => {

    switch(view){
    default:
    case 0:
        return(<StyledView><Overview /></StyledView>)
    case 1:
        return(<StyledView><AbsenceForm /></StyledView>)
    case 2:
        return(<StyledView><CompleteOverview /></StyledView>)
    }
}

export default AbsenceAdministration