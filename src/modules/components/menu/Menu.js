import React from 'react'
import { bool } from 'prop-types'
import { StyledMenu } from './Menu.styled'
import { useCallback } from 'react'
import Button from '../button/Button'

const Menu = ({ open, navigate, auth_level, setOpen, secure }) => {
    const button_size = '1.5rem'

    const nav = useCallback((e) => {
        setOpen(false)
        navigate(e)
    }, [navigate, setOpen])

    const insecure = () => {
        alert('Diese Funktion ist nur noch zugänglich, wenn ein Passwort gesetzt wurde.')
    }

    const buttons = [
        { id: 'main_button_0', label: 'Startseite', minAuth: 1, onClick: nav },
        { id: 'main_button_1', label: 'Anwesenheiten', minAuth: 1, onClick: nav },
        { id: 'main_button_2', label: 'Urlaub', minAuth: 1, onClick: nav },
        { id: 'main_button_3', label: 'Auswertung', minAuth: 3, onClick: nav },
        { id: 'main_button_4', label: 'Mitglieder', minAuth: 1, onClick: nav },
        { id: 'main_button_5', label: 'Termine', minAuth: 1, onClick: nav },
        { id: 'main_button_6', label: 'Noten', minAuth: 1, onClick: secure ? nav : insecure },
        { id: 'main_button_7', label: 'Bestellungen', minAuth: 1, onClick: nav },
        { id: 'main_button_8', label: 'Verwaltung', minAuth: 3, onClick: nav },
        { id: 'main_button_9', label: 'Einstellungen', minAuth: 1, onClick: nav },
        { id: 'main_button_10', label: 'Hilfe', minAuth: 1, onClick: nav },
    ]

    return (
        <StyledMenu open={open}>
            {buttons.map(({ id, label, minAuth, onClick }) => (
                auth_level >= minAuth && (
                    <Button key={id} type='button' id={id} font_size={button_size} onClick={onClick}>
                        {label}
                    </Button>
                )
            ))}
        </StyledMenu>
    )
}

Menu.propTypes = {
    open: bool.isRequired,
}

export default Menu