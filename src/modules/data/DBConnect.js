import Cookies from "universal-cookie"
import { mockDB } from "./MockDB"

const cookies = new Cookies()

let host = (process.env.NODE_ENV !== 'production') ? 'http://localhost' : ''

const login = async (name) => {
    let _forename, _surname, _api_token
    let response = await fetch(`${host}/api/login.php?mode=login&name=${name}`, {method: "GET"})
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

    return { _forename, _surname, _api_token }
}

const update_login = async () => {
    let _forename, _surname, _auth_level
    
    let token = cookies.get('api_token')
    let response = await fetch(`${host}/api/login.php?mode=update&api_token=${token}`)
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

    let response = await fetch(`${host}/api/event.php?api_token=${token}"&id=${event_id}`, {method: "GET"})

    switch (response.status) {
    case 200:
        event = await response.json()
        break
    default:
        break
    }
    
    return event
}

const getEvents = async (filter) => {
    let events = new Array(0)
    let token = cookies.get('api_token')

    if (process.env.NODE_ENV !== 'production') {
        events = mockDB.events
    } else {
        let response = await fetch(`${host}/api/event.php?filter=${filter}&api_token=${token}`, {method: "GET"})

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

const updateEvent = async(event_id, type, location, date, begin, departure, leave_dep, accepted) => {
    let token = cookies.get('api_token')
    let response = await fetch(`${host}/api/event.php?api_token=${token}`, {
        method: "PUT",
        body: JSON.stringify({
            Event_ID: event_id,
            Type: type,
            Location: location,
            Date: date,
            Begin: begin,
            Departure: departure,
            Leave_dep: leave_dep,
            Accepted: accepted
        })
    })
    switch(response.status){
    case 200:
        return true
    default:
        return false
    }
}

const newEvent = async (type, location, date, begin, departure, leave_dep, accepted) => {
    
    let token = cookies.get('api_token')
    
    let response = await fetch(`/api/event.php?api_token=${token}`, {
        method: "POST",
        body: JSON.stringify({
            Type: type,
            Location: location,
            Date: date,
            Begin: begin,
            Departure: departure,
            Leave_dep: leave_dep,
            Accepted: accepted
        })
    })
    switch(response.status){
    case 201:
        return true
    default:
        return false
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

    let response = await fetch(`${host}/api/member.php?api_token=${token}&id=${member_id}`, {method: "GET"})

    switch (response.status) {
    case 200:
        member = await response.json()
        break
    default:
        break
    }
    
    return member
}

const getMembers = async () => {
    let members = new Array(0)
    let token = cookies.get('api_token')

    let response = await fetch(`${host}/api/member.php?api_token=${token}`, {method: "GET"})

    switch (response.status) {
        case 200:
            members = await response.json()
            break
        default:
            break
    }

    return members
}

const updateMember = async(member_id, forename, surname, auth_level, nicknames, instrument) => {
    
    let token = cookies.get('api_token')
    
    let response = await fetch(`${host}/api/member.php?api_token=${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Member_ID: member_id,
            Forename: forename,
            Surname: surname,
            Auth_level: auth_level,
            Nicknames: nicknames,
            Instrument: instrument
        })
    })
    switch(response.status){
    case 200:
        return true
    default:
        return false
    }
}

const newMember = async(forename, surname, auth_level, nicknames, instrument) => {
    
    let token = cookies.get('api_token')

    let response = await fetch(`${host}/api/member.php?api_token=${token}`, {
        method: "POST",
        body: JSON.stringify({
            Forename: forename,
            Surname: surname,
            Auth_level: auth_level,
            Nicknames: nicknames,
            Instrument: instrument
        })
    })
    switch(response.status){
    case 200:
        return true
    default:
        return false
    }
}

const setAttendence = async (event_id, member_id, attendence) => {

    let token = cookies.get('api_token')

    let response = await fetch(`${host}/api/attendence.php?api_token=${token}&single`, {
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
    
    if(all){
        let response = await fetch(`${host}/api/attendence.php?api_token=${token}&all=true`, {
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
        let response = await fetch('/api/absence.php?id=' + absence_id + '&api_token=' + token, {
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
        return mockDB.absenceOwn
    } else {
        let token = cookies.get('api_token')
        let response = await fetch('/api/absence.php?api_token=' + token + '&filter='+ filter, {
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

export const updateAbsence = async (absence_id, member_id, from, until, info) => {
    if(process.env.NODE_ENV !== 'production') {
        return
    } else {
        let token = cookies.get('api_token')
        let response = await fetch('/api/absence.php?api_token=' + token + '&id=' + absence_id, {
            method: 'PUT',
            body: JSON.stringify({
                Member_ID: member_id,
                From: from,
                Until: until,
                Info: info
            })
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
        let response = await fetch('/api/absence.php?api_token=' + token, {
            method: 'POST',
            header: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                From: from,
                Until: until,
                Info: info
            })
        })
        switch(response.status){
        case 201:
            alert('Angaben übernommen')
            break
        default:
            alert('ein Fehler ist aufgetreten')
            break
        }
    }
}

export const deleteAbsence = async (absence_id) => {

    if(process.env.NODE_ENV !== 'production'){
        return
    }
    
    let token = cookies.get('api_token')
    let response = await fetch(`/api/absence.php?api_token=${token}&id=${absence_id}`, {
        method: 'DELETE'
    })
    switch(response.status){
    case 204:
        alert('gelöscht')
        break
    case 404:
        alert('Abwesenheit nicht vorhanden')
        break
    default:
        alert('ein Fehler ist aufgetreten')
        break
    }
}

export { login, update_login, getEvent, getEvents, updateEvent, newEvent, getMember, getMembers, updateMember, newMember, setAttendence, getAttendences, updateAttendences, getMissingFeedback, getEval }