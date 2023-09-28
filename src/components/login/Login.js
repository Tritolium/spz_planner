import { useCallback, useState } from "react"
import StyledLogin from "./Login.styled"
import { sha256 } from "js-sha256"

const Login = (props) => {

    const [name, setName] = useState("")
    const [passwd, setPasswd] = useState("")

    const sendLogin = useCallback(async (e) => {
        e.preventDefault()
        props.sendLogin(name, sha256(passwd))
    }, [name, passwd, props])

    const onNameChange = (e) => {
        setName(e.target.value)
    }

    const onPWChange = (e) => {
        setPasswd(e.target.value)
    }

    return(
        <StyledLogin onSubmit={sendLogin}>
            <input id="loginname" type="text" onChange={onNameChange} placeholder="Namen eingeben"></input>
            <input id="passwd" type="password" onChange={onPWChange} placeholder="" aria-label="Passwort"></input>
            <button type="submit">Login</button>
        </StyledLogin>
    )
}

export default Login