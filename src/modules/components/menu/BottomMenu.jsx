import { StyledBottomMenu, StyledMenuItem } from "./BottomMenu.styled"

export const BottomMenu = ({ view, navigate}) => {

    console.log(view)

    const buttons = [
        { id: 'main_button_0', label: 'Startseite', onClick: navigate, active: view === 0 },
        { id: 'main_button_1', label: 'Anwesenheit / Rückmeldung', onClick: navigate, active: view === 1 },
        { id: 'main_button_2', label: 'Urlaub / Abmeldung', onClick: navigate, active: view === 2 },
        { id: 'main_button_5', label: 'Termine', onClick: navigate, active: view === 5 },
    ]

    return(
        <StyledBottomMenu>
            {buttons.map(({ id, label, onClick, active }) => MenuItem(id, label, onClick, active))}
        </StyledBottomMenu>
    )
}

const MenuItem = (id, label, onClick, active) => {
    console.log(active)

    return(
        <StyledMenuItem activeView={active} key={id} type='button' id={id} onClick={onClick}>
            {label}
        </StyledMenuItem>
    )
}