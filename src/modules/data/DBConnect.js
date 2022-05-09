const login = async (name) => {
    let _forename, _surname, _api_token
    if(process.env.NODE_ENV !== 'production'){
        console.log('not production')
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

export { login }