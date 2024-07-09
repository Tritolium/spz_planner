// This helper checks if the user has the required permissions to access a certain section of the application.
// The permissions are stored in the local storage and are fetched from the server when the user logs in.
// 

export const hasPermission = (permission, association_id = null) => {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');

    if (association_id === null) {
        for (let assoc in permissions) {
            if (permissions[assoc].includes(permission)) {
                return true
            }
        }
    } else {
        if (permissions[association_id]?.includes(permission)) {
            return true
        }
    }

    return false
}