import Cookies from "universal-cookie"

const mockDB = {
    events: [
        {
            Event_ID: 1,
            Type: "Freundschaftstreffen",
            Location: "Oelinghauserheide",
            Date: "2022-05-14",
            Begin: "14:30:00",
            Departure: "14:00:00",
            Leave_dep: "12:34:56",
            Accepted: 1
        },
        {
            Event_ID: 2,
            Type: "Schützenfest",
            Location: "Ennest",
            Date: "2022-07-17",
            Begin: "12:34:56",
            Departure: "12:34:56",
            Leave_dep: "12:34:56",
            Accepted: 0
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
    ],
    attendences: [
        {
            Attendence: 0,
            Event_ID: 4,
            Type: "Tag der offenen Tür",
            Location: "OGS Rönkhausen",
            Date: "2022-06-15"
        },
        {
            Attendence: 1,
            Event_ID: 5,
            Type: "Heimspiel",
            Location: "Rönksen!",
            Date: "2022-07-02"
        },
        {
            Attendence: 2,
            Event_ID: 3,
            Type: "Schützenfest",
            Location: "Endorf",
            Date: "2022-07-10"
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

const getEvent = async (event_id) => {
    let event
    let token = cookies.get('api_token')

    if(event_id < 0){
        return {
            Event_ID: -1,
            Type: "",
            Location: "",
            Date: "01-01-1901",
            Begin: "12:12",
            Departure: "12:12",
            Leave_dep: "12:12"
        }
    }

    if(process.env.NODE_ENV !== 'production') {
        for(let i in mockDB.events){
            let eve = mockDB.events[i]
            if(eve.Event_ID === event_id){
                event = eve
            }
        }
    } else {
        let response = await fetch("/api/event.php?api_token=" + token + "&id=" + event_id, {method: "GET"})

        switch (response.status) {
        case 200:
            event = await response.json()
            break
        default:
            break
        }
    }
    
    return event
}

const getEvents = async (filter) => {
    let events = new Array(0)
    let token = cookies.get('api_token')

    if (process.env.NODE_ENV !== 'production') {
        events = mockDB.events
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

const updateEvent = async(event) => {
    let token = cookies.get('api_token')
    if(process.env.NODE_ENV !== 'production'){
        // TODO update in MockDB
        console.log('update MockDB')
    } else {
        let response = await fetch("/api/event.php?api_token=" + token, {
            method: "PUT",
            body: JSON.stringify(event)
        })
        switch(response.status){
        case 200:
            return true
        default:
            return false
        }
    }
}

const newEvent = async (event) => {
    let token = cookies.get('api_token')
    if(process.env.NODE_ENV !== 'production'){
        // TODO create in MockDB
        console.log('create in MockDB')
    } else {
        let response = await fetch("/api/event.php?api_token=" + token, {
            method: "POST",
            body: JSON.stringify(event)
        })
        switch(response.status){
        case 201:
            return true
        default:
            return false
        }
    }
}

const getMember = async (member_id) => {
    let member
    let token = cookies.get('api_token')

    if(member_id < 0){
        return {
            Member_ID: -1,
            Forename: "",
            Surname: "",
            Auth_level: 0
        }
    }

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
    let token = cookies.get('api_token')
    if(process.env.NODE_ENV !== 'production'){
        // TODO update in MockDB
    } else {
        let response = await fetch("/api/member.php?api_token=" + token, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Member_ID: member.Member_ID,
                Forename: member.Forename,
                Surname: member.Surname,
                Auth_level: member.Auth_level,
                Nicknames: member.Nicknames
            })
        })
        switch(response.status){
        case 200:
            return true
        default:
            return false
        }
    }
}

const newMember = async(member) => {
    let token = cookies.get('api_token')
    if(process.env.NODE_ENV !== 'production'){
        // TODO post in MockDB
    } else {
        let response = await fetch("/api/member.php?api_token=" + token, {
            method: "POST",
            body: JSON.stringify({
                Forename: member.Forename,
                Surname: member.Surname,
                Auth_level: member.Auth_level,
                Nicknames: member.Nicknames
            })
        })
        switch(response.status){
        case 200:
            return true
        default:
            return false
        }
    }
}

const getAttendences = async () => {
    let attendences = new Array(0)
    let token = cookies.get('api_token')
    if(process.env.NODE_ENV !== 'production'){
        attendences = mockDB.attendences
    } else {
        let response = await fetch("/api/attendence.php?api_token=" + token, {
            method: "GET"
        })
        switch(response.status){
        case 200:
            attendences = await response.json()
            break
        default:
            break
        }
    }
    return attendences
}

const updateAttendences = async (changes) => {
    let token = cookies.get('api_token')
    if(process.env.NODE_ENV !== 'production'){
        // TODO set in MockDB
    } else {
        fetch("/api/attendence.php?api_token=" + token, {
            method: "PUT",
            body: JSON.stringify(changes)
        }).then(
            res => {
                console.log(res.status)
                if(res.status === 200)
                    return true
                return false
            }
        )
    }
}

export { login, update_login, getEvent, getEvents, updateEvent, newEvent, getMember, getMembers, updateMember, newMember, getAttendences, updateAttendences }