import { StyledBottomMenu, StyledMenuItem } from "./BottomMenu.styled"

export const BottomMenu = ({ view, navigate}) => {

    const buttons = [
        { id: 'bottommenu_button_0', label: 'Startseite', onClick: navigate, active: view === 0 },
        { id: 'bottommenu_button_1', label: 'Anwesenheit / Rückmeldung', onClick: navigate, active: view === 1 },
        { id: 'bottommenu_button_2', label: 'Urlaub / Abmeldung', onClick: navigate, active: view === 2 },
        { id: 'bottommenu_button_5', label: 'Termine', onClick: navigate, active: view === 5 },
    ]

    return(
        <StyledBottomMenu>
            {buttons.map(({ id, label, onClick, active }) => MenuItem(id, label, onClick, active))}
        </StyledBottomMenu>
    )
}

const MenuItem = (id, label, onClick, active) => {
    return(
        <StyledMenuItem activeView={active} key={id} type='button' id={id} onClick={onClick}>
            {label}
        </StyledMenuItem>
    )
}