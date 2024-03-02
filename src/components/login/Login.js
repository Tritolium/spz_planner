import { useCallback } from "react"
import StyledLogin from "./Login.styled"
import { sha256 } from "js-sha256"

// TODO: remove password info on 01/12/2024

const Login = (props) => {

    const sendLogin = useCallback(async (e) => {
        e.preventDefault()
        let name = document.getElementById("loginname").value
        let passwd = document.getElementById("passwd").value
        props.sendLogin(name, sha256(passwd))
    }, [props])

    return(
        <StyledLogin onSubmit={sendLogin}>
            <input id="loginname" type="text" placeholder="Namen eingeben"></input>
            <input id="passwd" type="password" placeholder="Passwort" aria-label="Passwort"></input>
            <i>Passwort nur notwendig, wenn schon eins vergeben wurde, standardmäßig nicht der Fall</i>
            <button type="submit">Login</button>
        </StyledLogin>
    )
}

export default Login