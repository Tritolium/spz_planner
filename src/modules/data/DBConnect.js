import Cookies from "universal-cookie"
import { mockDB } from "./MockDB"

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

const setAttendence = async (event_id, member_id, attendence) => {
    let token = cookies.get('api_token')
    let response = await fetch("/api/attendence.php?api_token=" + token + "&single", {
        method: "PUT",
        body: JSON.stringify({
            Event_ID: event_id,
            Member_ID: member_id,
            Attendence: attendence
        })
    })
    switch(response.status){
    case 200:
        alert("Angaben übernommen")
        break
    default:
        alert("Ein Fehler ist aufgetreten")
    }
}

const getAttendences = async (all) => {
    let attendences = new Array(0)
    let token = cookies.get('api_token')
    if(process.env.NODE_ENV !== 'production'){
        if(all){
            attendences = mockDB.allAttendences
        } else {
            attendences = mockDB.attendences
        }
    } else {
        if(all){
            let response = await fetch("/api/attendence.php?api_token=" + token + "&all=true", {
                method: "GET"
            })
            switch(response.status){
            case 200:
                attendences = await response.json()
                break
            default:
                break
            }
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
                if(res.status === 200)
                    alert('Angaben übernommen')
                else
                    alert('Ein Fehler ist aufgetreten')
            }
        )
    }
}

const getMissingFeedback = async () => {
    if(process.env.NODE_ENV !== 'production'){
        return []
    } else {
        let token = cookies.get('api_token')
        let response = await fetch("/api/attendence.php?api_token=" + token + "&missing", {
            method: "GET"
        })
        switch(response.status){
        case 200:
            let json = await response.json()
            return json
        default:
            return
        }
    }
}

const getEval = async () => {
    if(process.env.NODE_ENV !== 'production'){
        return mockDB.evaluation
    } else {
        let token = cookies.get('api_token')
        let response = await fetch("/api/eval.php?api_token=" + token + "&events", {
            method: "GET"
        })
        switch(response.status){
        case 200:
            let json = await response.json()
            return json
        default:
            return
        }
    }
    
}

/**
 * Absence
 */

export const getAbsence = async (absence_id) => {
    if(process.env.NODE_ENV !== 'production'){
        return
    } else {
        let token = cookies.get('api_token')
        let response = await fetch('/api/absences.php?id=' + absence_id + '&api_token=' + token, {
            metod: 'GET'
        })
        switch(response.status){
        case 200:
            let json = await response.json()
            return json
        default:
            return
        }
    }
}

export const getAbsences = async (filter) => {
    if(process.env.NODE_ENV !== 'production'){
        switch(filter){
        case 'own':
            return mockDB.absenceOwn
        default:
            return
        }
    } else {
        let token = cookies.get('api_token')
        let response = await fetch('/api/absences.php?all&api_token=' + token + '&filter='+ filter, {
            method: 'GET'
        })
        switch(response.status){
        case 200:
            let json = await response.json()
            return json
        default:
            return
        }
    }
}

export const updateAbsence = async (absence_id, from, until, info) => {
    if(process.env.NODE_ENV !== 'production') {
        return
    } else {
        let token = cookies.get('api_token')
        let response = await fetch('/api/absences.php?api_token=' + token + '&id=' + absence_id, {
            method: 'PUT',
            body: {
                From: from,
                Until: until,
                Info: info
            }
        })
        switch(response.status){
        case 200:
            return
        default:
            alert('ein Fehler ist aufgetreten')
        }
    }
}

export const newAbsence = async (from, until, info) => {
    if(process.env.NODE_ENV !== 'production'){
        return
    } else {
        let token = cookies.get('api_token')
        let response = await fetch('/api/absences.php?api_token=' + token, {
            method: 'POST',
            body: {
                From: from,
                Until: until,
                Info: info
            }
        })
        switch(response.status(201)){
        case 201:
            alert('Angaben übernommen')
            break
        default:
            alert('ein Fehler ist aufgetreten')
            break
        }
    }
}

export { login, update_login, getEvent, getEvents, updateEvent, newEvent, getMember, getMembers, updateMember, newMember, setAttendence, getAttendences, updateAttendences, getMissingFeedback, getEval }