import React from 'react'
import { bool, func } from 'prop-types'
import { StyledBurger } from "./Burger.styled"

const Burger = ({open, setOpen}) => {

    const onClick = async () => {
        setOpen(!open)
        const registration = await navigator.serviceWorker?.getRegistration()
        registration?.waiting?.postMessage('SKIP_WAITING')
        // const options = {
        //     body: 'Simple piece of body text.\nSecond line of body text :)'
        // };
        // Notification.requestPermission().then(
        //     registration.showNotification('Titel', options)
        // )
    }

    return(
        <StyledBurger id='main_menu' title='Hauptmenü' type='button' open={open} onClick={onClick}>
            <div />
            <div />
            <div />
        </StyledBurger>
    )
}

Burger.propTypes = {
    open: bool.isRequired,
    setOpen: func.isRequired
}

export default Burger