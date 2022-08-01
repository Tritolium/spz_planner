import React, { useState } from 'react'
import Button from '../../modules/components/button/Button'
import Overview from './overview/Overview';
import { StyledAbsenceAdministration, StyledView } from './AbsenceAdministration.styled'
import AbsenceForm from './absenceform/AbsenceForm';

const AbsenceAdministration = () => {

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
        }
    }

    return(
        <StyledAbsenceAdministration>
            <nav>
                <Button id="absence_button_0" onClick={navigate}>Übersicht</Button>
                <Button id="absence_button_1" onClick={navigate}>Eingabe</Button>
            </nav>
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
    }
}

export default AbsenceAdministration