import Cookies from "universal-cookie"
import * as maptilerClient from '@maptiler/client'

maptilerClient.config.apiKey = 'm4hEVQNm2k3vfyEB1Bsy'

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
            cookies.set('api_token', json.API_token, {maxAge: 604800})
            localStorage.setItem('api_token', json.API_token)
            break
        default:
        case 404:
            break
    }

    return { _forename, _surname, _api_token }
}

const update_login = async () => {
    let _forename, _surname, _auth_level
    
    let token = localStorage.getItem('api_token')
    let response = await fetch(`${host}/api/login.php?mode=update&api_token=${token}`)
    switch(response.status) {
        case 200:
            let json = await response.json()
            _forename = json.Forename
            _surname = json.Surname
            _auth_level = json.Auth_level
            cookies.remove('api_token')
            cookies.set('api_token', token, {maxAge: 604800})
            localStorage.setItem('api_token', token)
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
    //let token = localStorage.getItem('api_token')

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
    
    let token = localStorage.getItem('api_token')
    let lastmodified = JSON.parse(localStorage.getItem('events_' + filter))?.lastmodified
    let response = await fetch(`${host}/api/event.php?filter=${filter}&api_token=${token}`, {
        method: 'GET',
        headers: lastmodified ? {
            'If-Modified-Since': lastmodified
        } : {}
    })

    switch(response.status) {
        case 200:
            events = await response.json()
            let store = {
                lastmodified: response.headers.get('DB-Last-Modified'),
                data: events
            }
            localStorage.setItem('events_' + filter, JSON.stringify(store))
            break
        case 304:
            events = JSON.parse(localStorage.getItem('events_' + filter))?.data
            break
        default:
            break
    }
    
    return events
}

const updateEvent = async(event_id, type, location, date, begin, departure, leave_dep, accepted, usergroup, clothing) => {
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')
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
            Accepted: accepted,
            Usergroup_ID: usergroup,
            Clothing: clothing
        })
    })
    switch(response.status){
    case 200:
        alert('Angaben übernommen')
        return true
    default:
        alert('Ein Fehler ist aufgetreten')
        return false
    }
}

const newEvent = async (type, location, date, begin, departure, leave_dep, accepted, usergroup, clothing) => {
    
    let token = cookies.get('api_token')
    
    let response = await fetch(`${host}/api/event.php?api_token=${token}`, {
        method: "POST",
        body: JSON.stringify({
            Type: type,
            Location: location,
            Date: date,
            Begin: begin,
            Departure: departure,
            Leave_dep: leave_dep,
            Accepted: accepted,
            Usergroup_ID: usergroup,
            Clothing: clothing
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
    //let token = localStorage.getItem('api_token')

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

    let token = localStorage.getItem('api_token')

    let lastmodified = JSON.parse(localStorage.getItem('members'))?.lastmodified
    let response = await fetch(`${host}/api/member.php?api_token=${token}`, {
        method: 'GET',
        headers: lastmodified ? {
            'If-Modified-Since': lastmodified
        } : {}
    })

    switch (response.status) {
        case 200:
            members = await response.json()
            let store = {
                lastmodified: response.headers.get('DB-Last-Modified'),
                data: members
            }
            localStorage.setItem('members', JSON.stringify(store))
            break
        case 304:
            members = JSON.parse(localStorage.getItem('members'))?.data
            break
        default:
            break
    }

    return members
}

const updateMember = async(member_id, forename, surname, auth_level, nicknames, instrument, changes) => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

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
            Instrument: instrument,
            UsergroupChanges: changes
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
    //let token = localStorage.getItem('api_token')

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
    //let token = localStorage.getItem('api_token')

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

const getAttendences = async () => {
    
    let attendences = new Array(0)
    
    let token = localStorage.getItem('api_token')

    let lastmodified = JSON.parse(localStorage.getItem('attendences'))?.lastmodified    
    let response = await fetch(`${host}/api/attendence.php?api_token=${token}`, {
        method: "GET",
        headers: lastmodified ? {
            'If-Modified-Since': lastmodified
        } : {}
    })
    switch(response.status){
    case 200:
        attendences = await response.json()
        let store = {
            lastmodified: response.headers.get('DB-Last-Modified'),
            data: attendences
        }
        localStorage.setItem('attendences', JSON.stringify(store))
        break
    case 304:
        attendences = JSON.parse(localStorage.getItem('attendences'))?.data
        break
    default:
        break
    }

    return attendences
}

export const getAllAttendences = async (usergroup_id) => {
    let attendences = new Array(0)
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/attendence.php?api_token=${token}&all=true&usergroup=${usergroup_id}`, {
        method: "GET"
    })

    switch(response.status){
    case 200:
        attendences = await response.json()
        break
    default:
        break
    }

    return attendences
}

const updateAttendences = async (changes, feedback=true) => {
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')
    
    fetch(`${host}/api/attendence.php?api_token=${token}`, {
        method: "PUT",
        body: JSON.stringify(changes)
    }).then(
        res => {
            if(feedback){
                if(res.status === 200)
                    alert('Angaben übernommen')
                else
                    alert('Ein Fehler ist aufgetreten')
            }
        }
    )
}

const getMissingFeedback = async () => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/attendence.php?api_token=${token}&missing`, {
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

const getEval = async (usergroup_id) => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/eval.php?api_token=${token}&usergroup=${usergroup_id}&events`, {
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

/**
 * Absence
 */

export const getAbsence = async (absence_id) => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/absence.php?id=${absence_id}&api_token=${token}`, {
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

export const getAbsences = async (filter) => {

    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/absence.php?api_token=${token}&filter=${filter}`, {
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

export const updateAbsence = async (absence_id, member_id, from, until, info) => {

    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`/api/absence.php?api_token=${token}&id=${absence_id}`, {
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

export const newAbsence = async (from, until, info) => {

    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/absence.php?api_token=${token}`, {
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
        alert('Abwesenheit eingetragen')
        break
    default:
        alert('ein Fehler ist aufgetreten')
        break
    }
}

export const newManualAbsence = async (member_id, from, until, info) => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/absence.php?api_token=${token}`, {
        method: 'POST',
        header: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            Member_ID:  member_id,
            From:       from,
            Until:      until,
            Info:       info
        })
    })

    switch(response.status) {
    case 201:
        alert('Abwesenheit eingetragen')
        break
    default:
        alert('Ein Fehler ist aufgetreten')
        break
    }
}

export const deleteAbsence = async (absence_id) => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/absence.php?api_token=${token}&id=${absence_id}`, {
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

export const getAllAbsences = async (filter) => {

    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/absence.php?api_token=${token}&filter=${filter}&all`, {
        method: 'GET'
    })
    switch(response.status){
    case 200:
        return await response.json()
    default:
        return
    }
}

export const newUsergroup = async (title, admin, moderator, info) => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/usergroup.php?api_token=${token}`, {
        method: 'POST',
        body: JSON.stringify({
            Title:      title,
            Admin:      admin,
            Moderator:  moderator,
            Info:       info
        })
    })

    switch(response.status){
    case 201:
        alert('Nutzergruppe erstellt')
        break
    default:
        alert('Ein fehler ist aufgetreten')
        break
    }
}

export const updateUsergroup = async (usergroup_id, title, admin, moderator, info) => {

    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&id=${usergroup_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            Title:      title,
            Admin:      admin,
            Moderator:  moderator,
            Info:       info
        })
    })

    switch(response.status){
    case 200:
        alert('Nutzergruppe aktualisiert')
        break
    default:
        alert('Ein fehler ist aufgetreten')
        break
    }
}

export const deleteUsergroup = async (usergroup_id) => {

    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&id=${usergroup_id}`, {
        method: 'DELETE'
    })

    switch(response.status){
    case 204:
        alert('Nutzergruppe gelöscht')
        break
    default:
        alert('Ein fehler ist aufgetreten')
        break
    }

}

export const getUsergroup = async (usergroup_id) => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&id=${usergroup_id}`, {
        method: 'GET'
    })

    switch(response.status){
    case 200:
        let json = await response.json()
        return json
    default:
        break
    }
}

export const getUsergroups = async () => {
    
    let token = cookies.get('api_token')
    //let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&search`, {
        method: 'GET'
    })

    switch(response.status){
    case 200:
        let json = await response.json()
        return json
    default:
        break
    }
}

export const getOwnUsergroups = async () => {
    
    let token = localStorage.getItem('api_token')

    let lastmodified = JSON.parse(localStorage.getItem('own_usergroups'))?.lastmodified
    let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&own=${true}`, {
        method: 'GET',
        headers: lastmodified ? {
            'If-Modified-Since': lastmodified
        } : {}
    })

    let json
    switch(response.status){
    case 200:
        json = await response.json()
        let store = {
            lastmodified: response.headers.get('DB-Last-Modified'),
            data: json
        }
        localStorage.setItem('own_usergroups', JSON.stringify(store))
        break
    case 304:
        json = JSON.parse(localStorage.getItem('own_usergroups'))?.data
        break
    default:
        break
    }
    return json
}

export const getUsergroupAssignments = async() => {
    
    let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&array`, {
        method: 'GET'
    })

    switch(response.status){
    case 200:
        let json = await response.json()
        return json
    default:
        break
    }
}

export const updateUsergroupAssignments = async (changedAssignments) => {
    
    let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&assign`, {
        method: 'PUT',
        body: JSON.stringify(changedAssignments)
    })

    switch(response.status){
    case 200:
        alert('Zuweisungen übernommen')
        break
    default:
        alert('Zuweisung fehlgeschlagen')
        break
    }
}

/**
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {string} type 
 * @param {string} location 
 * @param {Date} begin 
 * @param {Date} departure 
 * @param {Date} leave_dep 
 * @param {int} usergroup_id 
 */
export const newDateTemplate = async (title, description, type, location, begin, departure, leave_dep, usergroup_id) => {

    let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/datetemplate.php?api_token=${token}`, {
        method: "POST",
        body: JSON.stringify({
            Title           : title,
            Description     : description,
            Type            : type,
            Location        : location,
            Begin           : begin,
            Departure       : departure,
            Leave_dep       : leave_dep,
            Usergroup_ID    : usergroup_id
        })
    })

    switch(response.status){
    case 201:
        alert('Vorlage erstellt')
        break
    default:
        alert('Ein Fehler ist aufgetreten')
        break
    }
}

/**
 * 
 * @param {string} template_id 
 * @param {string} title 
 * @param {string} description 
 * @param {string} type 
 * @param {string} location 
 * @param {Date} begin 
 * @param {Date} departure 
 * @param {Date} leave_dep 
 * @param {int} usergroup_id 
 */
export const updateDateTemplate = async (template_id, title, description, type, location, begin, departure, leave_dep, usergroup_id) => {

    let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/datetemplate.php?api_token=${token}&template_id=${template_id}`, {
        method: "PUT",
        body: JSON.stringify({
            Title           : title,
            Description     : description,
            Type            : type,
            Location        : location,
            Begin           : begin,
            Departure       : departure,
            Leave_dep       : leave_dep,
            Usergroup_ID    : usergroup_id
        })
    })

    switch(response.status){
    case 200:
        alert('Vorlage gespeichert')
        break
    default:
        alert('Ein Fehler ist aufgetreten')
        break
    }
}

export const getDateTemplates = async () => {

    let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/datetemplate.php?api_token=${token}`, {
        method: "GET"
    })

    switch(response.status){
    case 200:
        let json = await response.json()
        return json
    default:
        break
    }
}

export const newAssociation = async (title, firstchair, clerk, treasurer) => {
    
    let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/association.php?api_token=${token}`, {
        method: 'POST',
        body: JSON.stringify({
            Title:      title,
            FirstChair: firstchair,
            Clerk:      clerk,
            Treasurer:  treasurer
        })
    })

    switch(response.status){
    case 201:
        alert('Verein erstellt')
        break
    default:
        alert('Ein Fehler ist aufgetreten')
        break
    }
}

export const updateAssociation = async (id, title, firstchair, clerk, treasurer) => {
    
    let token = localStorage.getItem('api_token')

    let response = await fetch(`${host}/api/association.php?api_token=${token}&id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            Title:      title,
            FirstChair: firstchair,
            Clerk:      clerk,
            Treasurer:  treasurer
        })
    })

    switch(response.status){
    case 200:
        alert('Änderungen übernommen')
        break
    default:
        alert('Ein Fehler ist aufgetreten')
        break
    }
}

export const getAssociations = async () => {
    
    let token = localStorage.getItem('api_token')
    let associations = undefined

    let lastmodified = JSON.parse(localStorage.getItem('associations'))?.lastmodified
    let response = await fetch(`${host}/api/association.php?api_token=${token}`, {
        method: 'GET',
        headers: lastmodified ? {
            'If-Modified-Since': lastmodified
        } : {}
    })

    switch(response.status){
    case 200:
        associations = await response.json()
        let store = {
            lastmodified: response.headers.get('DB-Last-Modified'),
            data: associations
        }
        localStorage.setItem('associations', JSON.stringify(store))
        break
    case 304:
        associations = JSON.parse(localStorage.getItem('associations'))?.data
        break
    default:
        break
    }

    return associations
}

export const getWeather = async (nextEvent) => {
    let hour = parseInt(nextEvent.Begin.slice(0,2))
    let geo = await maptilerClient.geocoding.forward(nextEvent.Location)
    let response = await fetch(`https://api.open-meteo.com/v1/dwd-icon?latitude=${geo.features[0].center[1]}&longitude=${geo.features[0].center[0]}&hourly=apparent_temperature,weathercode&start_date=${nextEvent.Date}&end_date=${nextEvent.Date}&timezone=CET`)
    let json = await response.json()
    return({
        "Temperature": json.hourly.apparent_temperature[hour],
        "Weathercode": json.hourly.weathercode[hour]
    })
}

export { login, update_login, getEvent, getEvents, updateEvent, newEvent, getMember, getMembers, updateMember, newMember, setAttendence, getAttendences, updateAttendences, getMissingFeedback, getEval }