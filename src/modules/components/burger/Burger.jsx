import React from 'react'
import { StyledBurger } from "./Burger.styled"
import { notificationHelper } from '../../helper/NotificationHelper'
import { sendPushSubscription } from '../../data/DBConnect'

const Burger = ({ open, setOpen, onNotificationEnabled }) => {

    const notifyCallback = (result) => {
        if(typeof onNotificationEnabled === 'function'){
            onNotificationEnabled(result)
        }
    }

    const onClick = async () => {
        setOpen(!open)

        if(!window.Notification?.requestPermission){
            notifyCallback({ error: new Error('Notifications are not supported on this device.') })
            return
        }

        try {
            const permission = await window.Notification.requestPermission()
            if(permission !== 'granted'){
                notifyCallback({ error: new Error('Notification permission was not granted.') })
                return
            }

            const subscription = await notificationHelper.createNotificationSubscription('BD0AbKmeW7bACNzC9m0XSUddJNx--VoOvU2X0qBF8dODOBhHvFPjrKJEBcL7Yk07l8VpePC1HBT7h2FRK3bS5uA')
            const permissions = await sendPushSubscription(subscription, true)

            notifyCallback({ permissions })
        } catch (error) {
            console.error('Failed to send push subscription', error)
            notifyCallback({ error })
        }
    }

    return(
        <StyledBurger id='main_menu' title='Hauptmenü' type='button' open={open} onClick={onClick}>
            <div />
            <div />
            <div />
        </StyledBurger>
    )
}

export default Burger
