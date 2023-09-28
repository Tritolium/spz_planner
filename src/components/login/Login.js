import { useCallback } from "react"
import StyledLogin from "./Login.styled"
import { sha256 } from "js-sha256"

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
            <input id="passwd" type="password" placeholder="" aria-label="Passwort"></input>
            <button type="submit">Login</button>
        </StyledLogin>
    )
}

export default Login