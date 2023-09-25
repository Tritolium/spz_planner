import { useCallback, useEffect, useState } from "react"
import { StyledSettings } from "./Settings.styled"
import Button from "../../modules/components/button/Button"
import { sha256 } from "js-sha256"
import { host } from "../../modules/data/DBConnect"

const Settings = () => {

    const [userdata, setUserdata] = useState()

    let token = localStorage.getItem('api_token')

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

    useEffect(() => {
        fetchUserdata()
    }, [fetchUserdata])

    return(<StyledSettings>
        <table>
            <tbody>
                <tr>
                    <td>Name: </td>
                    <td>{userdata?.Fullname}</td>
                </tr>
                <tr>
                    <td>Geburtstag: </td>
                    <td>{userdata?.Birthdate}</td>
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
    </StyledSettings>)
}

export default Settings