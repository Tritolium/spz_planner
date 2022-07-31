import React from 'react'
import { bool } from 'prop-types'
import { StyledMenu } from './Menu.styled'

const Menu = ({open, navigate, auth_level}) => {
    return(
        <StyledMenu open={open}>
            {auth_level > 0 ? <button type='button' id='main_button_0' onClick={navigate}>Terminplaner</button> : <></>}
            {auth_level > 1 ? <button type='button' id='main_button_1' onClick={navigate}>Mitgliederverwaltung</button> : <></>}
            {auth_level > 1 ? <button type='button' id='main_button_2' onClick={navigate}>Terminverwaltung</button> : <></>}
        </StyledMenu>        
    )
}

Menu.propTypes = {
    open: bool.isRequired,
}

export default Menu