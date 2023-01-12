import { useState } from "react";
import Button from "../../modules/components/button/Button"
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import { StyledAdministration, StyledView } from "./Administration.styled"
import Associations from "./association/Associations";
import DateTemplates from "./datetemplates/DateTemplates";
import UsergroupAssignment from "./usergroupassignment/UsergroupAssignment";
import Usergroups from "./usergroups/Usergroups";

const Administration = () => {

    const [view, setView] = useState(0);

    const navigate = (e) => {
        switch(e.target.id) {
        default:
        case 'administration_button_0':
            setView(0)
            break
        case 'administration_button_1':
            setView(1)
            break
        case 'administration_button_2':
            setView(2)
            break
        case 'administration_button_3':
            setView(3)
            break
        }
    }

    return(
        <StyledAdministration>
            <HeaderMenu>
                <Button id='administration_button_0' onClick={navigate}>Vereine</Button>
                <Button id='administration_button_1' onClick={navigate}>Benutzergruppen</Button>
                <Button id='administration_button_2' onClick={navigate}>Gruppenzuordnung</Button>
                <Button id="administration_button_3" onClick={navigate}>Terminvorlagen</Button>
            </HeaderMenu>
            <View view={view}/>
        </StyledAdministration>
    )
}

const View = ({ view }) => {
    switch(view){
    default:
    case 0:
        return(<StyledView><Associations /></StyledView>)
    case 1:
        return(<StyledView><Usergroups /></StyledView>)
    case 2:
        return(<StyledView><UsergroupAssignment /></StyledView>)
    case 3:
        return(<StyledView><DateTemplates /></StyledView>)
    }
}

export default Administration