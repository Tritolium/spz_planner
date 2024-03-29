import { useState } from "react";
import Button from "../../modules/components/button/Button"
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import { StyledAdministration, StyledView } from "./Administration.styled"
import Associations from "./association/Associations";
import AssociationAssignment from "./associationassignment/AssociationAssignment";
import DateTemplates from "./datetemplates/DateTemplates";
import Scores from "./scores/Scores"
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
        case 'administration_button_4':
            setView(4)
            break
        case 'administration_button_5':
            setView(5)
            break
        }
    }

    return(
        <StyledAdministration>
            <HeaderMenu>
                <Button id='administration_button_0' onClick={navigate}>Vereine</Button>
                <Button id='administration_button_1' onClick={navigate}>Vereinzuordnung</Button>
                <Button id='administration_button_2' onClick={navigate}>Benutzergruppen</Button>
                <Button id='administration_button_3' onClick={navigate}>Gruppenzuordnung</Button>
                <Button id="administration_button_4" onClick={navigate}>Terminvorlagen</Button>
                <Button id="administration_button_5" onClick={navigate}>Noten</Button>
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
        return(<StyledView><AssociationAssignment /></StyledView>)
    case 2:
        return(<StyledView><Usergroups /></StyledView>)
    case 3:
        return(<StyledView><UsergroupAssignment /></StyledView>)
    case 4:
        return(<StyledView><DateTemplates /></StyledView>)
    case 5:
        return(<StyledView><Scores /></StyledView>)
    }
}

export default Administration