import { useState } from "react";
import Button from "../../modules/components/button/Button"
import HeaderMenu from "../../modules/components/headermenu/HeaderMenu"
import { StyledAdministration, StyledView } from "./Administration.styled"
import Usergroups from "./usergroups/Usergroups";

const Administration = () => {

    const [view, setView] = useState(0);

    const navigate = (e) => {
        switch(e.target.id) {
        default:
        case 'administration_button_0':
            setView(0)
            break;
        }
    }

    return(
        <StyledAdministration>
            <HeaderMenu>
                <Button id='administration_button_0' onClick={navigate}>Benutzergruppen</Button>
            </HeaderMenu>
            <View view={view}/>
        </StyledAdministration>
    )
}

const View = ({ view }) => {
    switch(view){
    default:
    case 0:
        return(<StyledView><Usergroups /></StyledView>)
    }
}

export default Administration