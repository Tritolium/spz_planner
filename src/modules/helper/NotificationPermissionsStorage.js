export const NOTIFICATION_PERMISSIONS_STORAGE_KEY = 'notificationPermissions'

export const readStoredNotificationPermissions = () => {
    try {
        const storedValue = localStorage.getItem(NOTIFICATION_PERMISSIONS_STORAGE_KEY)
        if(!storedValue){
            return null
        }

        return JSON.parse(storedValue)
    } catch (error) {
        console.error(error)
        return null
    }
}

export const persistNotificationPermissions = (permissions) => {
    try {
        if(permissions){
            localStorage.setItem(NOTIFICATION_PERMISSIONS_STORAGE_KEY, JSON.stringify(permissions))
            return
        }

        localStorage.removeItem(NOTIFICATION_PERMISSIONS_STORAGE_KEY)
    } catch (error) {
        console.error(error)
    }
}
