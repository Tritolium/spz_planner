import { useCallback } from "react"
import StyledLogin from "./Login.styled"
import { sha256 } from "js-sha256"

// TODO: remove password info on 01/12/2024
const serviceCell = process.env.REACT_APP_SERVICE_CELL
const text = "Hallo, ich habe mein Passwort vergessen. Kannst du es mir bitte zurücksetzen?"

const Login = (props) => {

    const sendLogin = useCallback(async (e) => {
        e.preventDefault()
        let name = document.getElementById("loginname").value
        let passwd = document.getElementById("passwd").value
        props.sendLogin(name, sha256(passwd))
    }, [props])

    const pwrequest = (e) => {
        e.preventDefault()        
        window.location.href = `http://wa.me/${serviceCell}?text=${text}`
    }

    return(
        <StyledLogin onSubmit={sendLogin}>
            <input id="loginname" type="text" placeholder="Namen eingeben"></input>
            <input id="passwd" type="password" placeholder="Passwort" aria-label="Passwort"></input>
            <i>Passwort nur notwendig, wenn schon eins vergeben wurde, standardmäßig nicht der Fall</i>
            <button type="submit">Login</button>
            <button onClick={pwrequest}>Passwort vergessen?</button>
        </StyledLogin>
    )
}

export default Login