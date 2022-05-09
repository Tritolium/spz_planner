import Cookies from "universal-cookie"

const login = async (name) => {
    let _forename, _surname, _api_token
    if(process.env.NODE_ENV !== 'production'){
        _forename = "Max"
        _surname = "Mustermann"
        _api_token = "development"
    } else {
        let response = await fetch("/api/login.php?mode=login&name=" + name, {method: "GET"})
        switch(response.status) {
            case 200:
                let json = await response.json()
                _forename = json.Forename
                _surname = json.Surname
                _api_token = json.API_token
                break
            default:
            case 404:
                break
        }
    }

    return { _forename, _surname, _api_token }
}

const update_login = async () => {
    let _forename, _surname, _auth_level
    
    let cookies = new Cookies()
    let token = cookies.get('api_token')

    if(process.env.NODE_ENV !== 'production'){
        _forename = "Max"
        _surname = "Mustermann"
        _auth_level = 3
    } else {
        let response = await fetch("/api/login.php?mode=update&api_token=" + token)
        switch(response.status) {
            case 200:
                let json = await response.json()
                _forename = json.Forename
                _surname = json.Surname
                _auth_level = json.Auth_level
                break
            default:
            case 404:
                cookies.remove('api_token')
                break
        }
    }
    return { _forename, _surname, _auth_level }
}

export { login, update_login }