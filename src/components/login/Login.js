import { useCallback, useState } from "react"

const Login = (props) => {

    const [name, setName] = useState("")

    const sendLogin = useCallback((e) => {
        e.preventDefault()
        props.sendLogin(name)
    }, [name, props])

    const onChange = (e) => {
        setName(e.target.value)
    }

    return(
        <form onSubmit={sendLogin}>
            <input type="text" onChange={onChange}></input>
            <button type="submit">Klick</button>
        </form>
    )
}

export default Login