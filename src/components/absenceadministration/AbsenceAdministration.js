import React, { Suspense, useState } from 'react'
import Button from '../../modules/components/button/Button'
import Overview from './overview/Overview';
import { StyledAbsenceAdministration, StyledView } from './AbsenceAdministration.styled'
import AbsenceForm from './absenceform/AbsenceForm';
import HeaderMenu from '../../modules/components/headermenu/HeaderMenu'
import CompleteOverview from './completeoverview/CompleteOverview';
import ManuelAbsenceInput from './manuelabsenceinput/ManuelAbsenceInput';

const AbsenceAdministration = ({ auth_level }) => {

    const [view, setView] = useState(0);

    const navigate = (e) => {
        let button_id = e.target.id.split('_')[2]
        setView(parseInt(button_id))
    }

    const buttons = [
        { id: 'absence_button_0', label: "Übersicht", permitted: true },
        { id: 'absence_button_1', label: "Eingabe", permitted: true },
        { id: 'absence_button_2', label: "Gesamtübersicht", permitted: auth_level > 2 },
        { id: 'absence_button_3', label: "manuelle Eingabe", permitted: auth_level > 2 }
    ]

    return(
        <StyledAbsenceAdministration>
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
            <View view={view}/>
        </StyledAbsenceAdministration>
    )
}

const View = ({ view }) => {

    const components = {
        '0': <Overview />,
        '1': <AbsenceForm />,
        '2': <CompleteOverview />,
        '3': <ManuelAbsenceInput />
    }

    return (
        <Suspense fallback={<div>Lädt...</div>}>
            <StyledView>
                {components[view]}
            </StyledView>
        </Suspense>
    )
}

export default AbsenceAdministration