import Cookies from "universal-cookie"

const mockDB = {
    dates: [
        {
            type: "Freundschaftstreffen",
            location: "Oelinghauserheide",
            date: "2022-05-14",
            begin: "14:30:00",
            departure: "14:00:00",
            leave_dep: "12:34:56"
        },
        {
            type: "Schützenfest",
            location: "Ennest",
            date: "2022-07-17",
            begin: "12:34:56",
            departure: "12:34:56",
            leave_dep: "12:34:56"
        }
    ],
    members: [
        {
            Member_ID: 1,
            Forename: "Max",
            Surname: "Mustermann",
            Auth_level: 0
        },
        {
            Member_ID: 2,
            Forename: "Erika",
            Surname: "Musterfrau",
            Auth_level: 1
        },
        {
            Member_ID: 3,
            Forename: "Otto",
            Surname: "Normalverbraucher",
            Auth_level: 2
        },{
            Member_ID: 4,
            Forename: "Lieschen",
            Surname: "Müller",
            Auth_level: 3
        }
    ]
}

const cookies = new Cookies()

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

const getEvents = async (filter) => {
    let events = new Array(0)
    let token = cookies.get('api_token')

    if (process.env.NODE_ENV !== 'production') {
        events = mockDB.dates
    } else {
        let response = await fetch("/api/event.php?filter=" + filter + "&api_token=" + token, {method: "GET"})

        switch(response.status) {
            case 200:
                events = await response.json()
                break
            default:
                break
        }
    }

    return events
}

const getMember = async (member_id) => {
    let member
    let token = cookies.get('api_token')

    if(process.env.NODE_ENV !== 'production') {
        for(let i in mockDB.members){
            let mem = mockDB.members[i]
            if(mem.Member_ID === member_id){
                member = mem
            }
        }
    } else {
        let response = await fetch("/api/member.php?api_token=" + token + "&id=" + member_id, {method: "GET"})

        switch (response.status) {
        case 200:
            member = await response.json()
            break
        default:
            break
        }
    }
    
    return member
}

const getMembers = async () => {
    let members = new Array(0)
    let token = cookies.get('api_token')

    if (process.env.NODE_ENV !== 'production') {
        members = mockDB.members
    } else {
        let response = await fetch("/api/member.php?api_token=" + token, {method: "GET"})

        switch (response.status) {
            case 200:
                members = await response.json()
                break
            default:
                break
        }
    }

    return members
}

const updateMember = async(member) => {
    console.log(member)
    let token = cookies.get('api_token')
    if(process.env.NODE_ENV !== 'production'){
        // TODO update in MockDB
    } else {
        let response = await fetch("/api/member.php?api_token=" + token, {
            method: "PUT",
            body: {
                Member_ID: member.Member_ID,
                Forename: member.Forename,
                Surname: member.Surname,
                Auth_level: member.Auth_level,
                Nicknames: member.Nicknames
            }
        })
        console.log(response.body)
        switch(response.status){
        case 200:
            return true
        default:
            return false
        }
    }
}

const newMember = async(member) => {
    console.log(member)
    // TODO post new Member via POST
}

export { login, update_login, getEvents, getMember, getMembers, updateMember, newMember }