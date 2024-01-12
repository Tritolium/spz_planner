import React from 'react'
import { bool, func } from 'prop-types'
import { StyledBurger } from "./Burger.styled"
import { notificationHelper } from '../../helper/NotificationHelper'
import { sendPushSubscription } from '../../data/DBConnect'

const Burger = ({open, setOpen}) => {

    const onClick = async () => {
        setOpen(!open)
        
        window.Notification?.requestPermission().then(permission => {
            if(permission === 'granted'){
                notificationHelper.createNotificationSubscription('BD0AbKmeW7bACNzC9m0XSUddJNx--VoOvU2X0qBF8dODOBhHvFPjrKJEBcL7Yk07l8VpePC1HBT7h2FRK3bS5uA')
                .then(subscription => {
                    sendPushSubscription(subscription, true)
                })
            }
        })
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