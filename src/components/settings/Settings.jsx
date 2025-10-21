import { useCallback, useEffect, useState } from "react"
import { StyledSettings } from "./Settings.styled"
import Button from "../../modules/components/button/Button"
import { sha256 } from "js-sha256"
import { host } from "../../modules/data/DBConnect"
import { sqlToString } from "../../modules/helper/DateFormat"
import { GoArrowUpLeft } from "react-icons/go"

const Settings = ({ secure }) => {

    const [userdata, setUserdata] = useState()
    const [notifyPermisssion, setNotifyPermission] = useState()

    let token = localStorage.getItem('api_token')
    let endpoint = localStorage.getItem('endpoint')

    const fetchUserdata = useCallback(async () => {
        let url = `${host}/api/user_settings.php?api_token=${token}`
        fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.status)
                return response.json()
            }).then(json => {
                setUserdata(json)
            }, () => {
                setUserdata({})
            }).catch(error => {
                //alert(error.message)
            })
    }, [token])

    const fetchNotifyPermission = useCallback(() => {
        fetch(`${host}/api/pushsubscription.php?api_token=${token}&endpoint=${endpoint}`)
        .then(response => {
            if(response.status === 200){
                return response.json()
            }
        }).then(json => {
            setNotifyPermission(json)
        })
    }, [token, endpoint])

    const changePasswd = useCallback(async (e) => {
        e.preventDefault()
        let oldPasswd = sha256(document.getElementById("old_passwd").value)
        let newPasswd = sha256(document.getElementById("passwd").value)
        let passwdWdh = sha256(document.getElementById("passwd_wdh").value)

        document.getElementById("old_passwd").value = ""
        document.getElementById("passwd").value = ""
        document.getElementById("passwd_wdh").value = ""

        if(passwdWdh !== newPasswd) {
            alert("Die Passwörter stimmen nicht überein!")
        } else {
            let url = `${host}/api/user_settings.php?api_token=${token}`
            fetch(url, {
                method: "PUT",
                body: JSON.stringify({
                    oldPassword: oldPasswd,
                    newPassword: newPasswd
                })
            })
        }
    }, [token])

    const notificationChange = useCallback(() => {
        let notifyCheck = document.getElementById('notification')
        if(notifyCheck.checked){
            document.getElementById('event').removeAttribute('disabled')
            document.getElementById('practice').removeAttribute('disabled')
            document.getElementById('other').removeAttribute('disabled')
        } else {
            document.getElementById('event').setAttribute('disabled', true)
            document.getElementById('practice').setAttribute('disabled', true)
            document.getElementById('other').setAttribute('disabled', true)
        }
    }, [])

    const ensureNotificationPermission = useCallback(async () => {
        if(!window.Notification?.requestPermission){
            alert("Benachrichtigungen werden von diesem Gerät nicht unterstützt.")
            return false
        }

        if(window.Notification.permission === 'granted'){
            return true
        }

        if(window.Notification.permission === 'denied'){
            alert("Benachrichtigungen wurden nicht aktiviert. Bitte erlaube Benachrichtigungen im Browser.")
            return false
        }

        const permission = await window.Notification.requestPermission()

        if(permission !== 'granted'){
            alert("Benachrichtigungen wurden nicht aktiviert. Bitte erlaube Benachrichtigungen im Browser.")
            return false
        }

        return true
    }, [])

    const savePermissions = useCallback(async () => {
        let notifyPermissions = {
            Allowed:    document.getElementById('notification').checked ? 1 : 0,
            Event:      document.getElementById('event').checked ? 1 : 0,
            Practice:   document.getElementById('practice').checked ? 1 : 0,
            Other:      document.getElementById('other').checked ? 1 : 0
        }

        if(notifyPermissions.Allowed === 1){
            const hasPermission = await ensureNotificationPermission()
            if(!hasPermission){
                return
            }
        }

        fetch(`${host}/api/pushsubscription.php?api_token=${token}&endpoint=${endpoint}`, {
            method: "PATCH",
            body: JSON.stringify(notifyPermissions)
        })
    }, [endpoint, token, ensureNotificationPermission])

    useEffect(() => {
        if(notifyPermisssion?.Allowed){
            document.getElementById('event').removeAttribute('disabled')
            document.getElementById('practice').removeAttribute('disabled')
            document.getElementById('other').removeAttribute('disabled')
        } else {
            document.getElementById('event').setAttribute('disabled', true)
            document.getElementById('practice').setAttribute('disabled', true)
            document.getElementById('other').setAttribute('disabled', true)
        }
        if(!secure)
            document.getElementById('old_passwd').setAttribute('disabled', true)
    }, [notifyPermisssion, secure])

    useEffect(() => {
        fetchUserdata()
        fetchNotifyPermission()
    }, [fetchUserdata, fetchNotifyPermission])

    return(<StyledSettings>
        {!secure && <div id="secureNotifier"><GoArrowUpLeft />Zurück zur Startseite</div>}
        {!secure && <>
            <h3>Warum bin ich auf dieser Seite gelandet?</h3>
            <p>
                Einige Nutzer haben versucht, sich mit fremden Namen einzuloggen. Um unberechtigte Zugriffe auf persönliche Daten zu verhindern, ist nun ein Passwort erforderlich.
            </p>
            <p>
                Wenn du bereits ein Passwort festgelegt hast, wirst du nach dem Anmelden wieder auf die Startseite weitergeleitet.
            </p>
            <p>
                In Zukunft könnte es auch möglich sein, dass ein zufälliges Passwort vergeben wird, falls du keines selbst festgelegt hast.
            </p>
        </>}
        <table>
            <tbody>
                <tr>
                    <td>Name: </td>
                    <td>{userdata?.Fullname}</td>
                </tr>
                <tr>
                    <td>Geburtstag: </td>
                    <td>{sqlToString(userdata?.Birthdate)}</td>
                </tr>
                <tr>
                    <td><label htmlFor="old_passwd">Altes Passwort: </label></td>
                    <td><input type="password" id="old_passwd" /></td>
                </tr>
                <tr>
                    <td><label htmlFor="passwd">Neues Passwort: </label></td>
                    <td><input type="password" id="passwd" /></td>
                </tr>
                <tr>
                    <td><label htmlFor="passwd_wdh">Passwort wiederholen: </label></td>
                    <td><input type="password" id="passwd_wdh" /></td>
                </tr>
                <tr>
                    <td colSpan={2}><Button onClick={changePasswd}>Passwort aktualisieren</Button></td>
                </tr>
            </tbody>
        </table>
        <table>
            <tbody>
                <tr>
                    <td colSpan={2}><label htmlFor="notification">Benachrichtigungen:</label></td>
                    <td><input type="checkbox" id="notification" defaultChecked={notifyPermisssion?.Allowed} onChange={notificationChange}/></td>
                </tr>
                <tr>
                    <td></td>
                    <td><label htmlFor="event">Auftritte:</label></td>
                    <td><input type="checkbox" id="event" defaultChecked={notifyPermisssion?.Event}/></td>
                </tr>
                <tr>
                    <td></td>
                    <td><label htmlFor="practice">Proben:</label></td>
                    <td><input type="checkbox" id="practice" defaultChecked={notifyPermisssion?.Practice}/></td>
                </tr>
                <tr>
                    <td></td>
                    <td><label htmlFor="other">Sonstige Termine:</label></td>
                    <td><input type="checkbox" id="other" defaultChecked={notifyPermisssion?.Other}/></td>
                </tr>
                <tr>
                    <td colSpan={3}><Button onClick={savePermissions}>Einstellungen speichern</Button></td>
                </tr>
            </tbody>
        </table>        
    </StyledSettings>)
}

export default Settings