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
import Roles from "./roles/Roles";
import RoleAssignment from "./roleassignment/RoleAssignment";
import { hasAnyPermission, hasPermission } from "../../modules/helper/Permissions";

const Administration = () => {

    const [view, setView] = useState(0);

    const labels = [
        'Vereine',
        'Vereinzuordnung',
        'Benutzergruppen',
        'Gruppenzuordnung',
        ...hasAnyPermission([3, 4]) ? ['Rollen'] : [],
        ...hasAnyPermission([3, 5]) ? ['Rollenzuordnung'] : [],
        'Terminvorlagen',
        'Noten'
    ]

    const navigate = (e) => {
        const buttonNumber = parseInt(e.target.id.split('_')[2]);
        if (!isNaN(buttonNumber)) {
            setView(buttonNumber);
        }
    }

    return(
        <StyledAdministration>
            <HeaderMenu>
                {labels.map((label, index) => (
                    <Button key={index} id={`Button_Administration_${index}`} onClick={navigate}>{label}</Button>
                ))}
            </HeaderMenu>
            <View view={view}/>
        </StyledAdministration>
    )
}

const View = ({ view }) => {

    const views = [
        <Associations />,
        <AssociationAssignment />,
        <Usergroups />,
        <UsergroupAssignment />,
        ...hasPermission(4) ? [<Roles />] : [],
        ...hasPermission(5) ? [<RoleAssignment />] : [],
        <DateTemplates />,
        <Scores />
    ]

    return(
        <StyledView>
            {views[view] || <Associations />}
        </StyledView>
    )
}

export default Administration