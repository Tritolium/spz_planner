import React from 'react'
import { bool } from 'prop-types'
import { StyledMenu } from './Menu.styled'
import { useCallback } from 'react'
import Button from '../button/Button'

const Menu = ({open, navigate, auth_level, setOpen, secure}) => {

    const button_size = '1.5rem'

    const nav = useCallback((e) => {
        setOpen(false)
        navigate(e)
    }, [navigate, setOpen])

    const insecure = () => {
        alert('Diese Funktion ist nur noch zugänglich, wenn ein Passwort gesetzt wurde.')
    }

    return(
        <StyledMenu open={open}>
            {auth_level > 0 ? <Button type='button' id='main_button_0' font_size={button_size} onClick={nav}>Startseite</Button> : <></>}
            {auth_level > 0 ? <Button type='button' id='main_button_1' font_size={button_size} onClick={nav}>Anwesenheiten</Button> : <></>}
            {auth_level > 0 ? <Button type='button' id='main_button_2' font_size={button_size} onClick={nav}>Urlaub</Button> : <></>}
            {auth_level > 2 ? <Button type='button' id='main_button_3' font_size={button_size} onClick={nav}>Auswertung</Button> : <></>}
            {auth_level > 0 ? <Button type='button' id='main_button_4' font_size={button_size} onClick={nav}>Mitglieder</Button> : <></>}
            {auth_level > 0 ? <Button type='button' id='main_button_5' font_size={button_size} onClick={nav}>Termine</Button> : <></>}
            {auth_level > 0 ? <Button type='button' id='main_button_6' font_size={button_size} onClick={secure? nav : insecure}>Noten</Button> : <></>}
            {auth_level > 0 ? <Button type='button' id='main_button_7' font_size={button_size} onClick={nav}>Bestellungen</Button> : <></>}
            {auth_level > 2 ? <Button type='button' id='main_button_8' font_size={button_size} onClick={nav}>Verwaltung</Button> : <></>}
            {auth_level > 0 ? <Button type='button' id='main_button_9' font_size={button_size} onClick={nav}>Einstellungen</Button> : <></>}
            {auth_level > 0 ? <Button type='button' id='main_button_10' font_size={button_size} onClick={nav}>Hilfe</Button> : <></>}
        </StyledMenu>        
    )
}

Menu.propTypes = {
    open: bool.isRequired,
}

export default Menu