import * as maptilerClient from "@maptiler/client"
import { version } from "../../App"
import { getItem, setItem } from "../helper/IndexedDB"

maptilerClient.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY

export const host = (import.meta.env.MODE !== "production") ? "http://localhost" : ""

export const getDisplayMode = () => {
	let displayMode = "browser tab"
	if(window.matchMedia("(display-mode: standalone)").matches) {
		displayMode = "standalone"
	} else if (window.matchMedia("(display-mode: fullscreen)").matches) {
		displayMode = "fullscreen"
	}

	return displayMode
}

export const getDeviceID = async () => {
	return getItem("device_id")
		.then(data => {
			if(data === undefined){
				let device_id = crypto.randomUUID()
				setItem("device_id", device_id)
				return device_id
			}
			return data
		})
}

const getDeviceNotificationPermission = () => {
	if (!("Notification" in window)) 
		return -2
	switch(window.Notification?.permission){
	case "granted":
		return 1
	case "denied":
		return 0
	default:
		return -1
	}
}

export const getDevicePreferences = async () => {
	let preferences = [
		{ query: "(prefers-color-scheme: dark)", name: "darkmode" },
		{ query: "(prefers-color-scheme: light)", name: "lightmode" },
		{ query: "(forced-colors: active)", name: "forcedcolors" }
	]

	let results = await Promise.all(preferences.map(preference => {
		return window.matchMedia(preference.query).matches
	}))
	let preferencesObject = {}
	preferences.forEach((preference, index) => {
		preferencesObject[preference.name] = results[index]
	})

	return preferencesObject
}

export const sendError = async (error_msg) => {
	fetch(`${host}/api/v0/error`, {
		method: "POST",
		body: JSON.stringify({
			Error_Msg: error_msg,
			Engine: navigator.userAgent.match(/([A-Z][a-z]*)+\/\d+[.\d+]*/g).toString(),
			Device: navigator.userAgent.match(/(\([^(]+(\n[^(]+)*\))/g)[0],
			Dimension: `${window.innerWidth}x${window.innerHeight}`,
			DisplayMode: getDisplayMode(),
			Version: version,
			Token: localStorage.getItem("api_token")
		})
	}).catch(() => {})
}

const login = async (name, pwhash, version) => {
	let _forename, _surname, _api_token, _auth_level, _theme, error, permissions
	let _secure = true

	let displayMode = getDisplayMode()
	let device_id = await getDeviceID()
	let preferences = await getDevicePreferences()

	let response = await fetch(`${host}/api/login.php?mode=login`, {
		method: "POST",
		body: JSON.stringify({
			Version: version,
			Name: name,
			PWHash: pwhash,
			DisplayMode: displayMode,
			Engine: navigator.userAgent.match(/([A-Z][a-z]*)+\/\d+[.\d+]*/g).toString(),
			Device: navigator.userAgent.match(/(\([^(]+(\n[^(]+)*\))/g)[0],
			Dimension: `${window.innerWidth}x${window.innerHeight}`,
			DeviceUUID: device_id,
			Notification: getDeviceNotificationPermission(),
			Preferences: preferences
		})
	})
	switch(response.status) {
	case 200:
		if (response.headers.get("Content-Type") === "application/json") {
			let json = await response.json()
			_forename = json.Forename
			_surname = json.Surname
			_api_token = json.API_token
			_auth_level = json.Auth_level
			_theme = json.Theme
			error = json.Err
			permissions = json.Permissions
			if(error === 4)
				_secure = false

			localStorage.setItem("api_token", json.API_token)
			localStorage.setItem("auth_level", _auth_level)
			localStorage.setItem("permissions", JSON.stringify(permissions))
		} else {
			response.text().then(text => {
				sendError(text)
			})
		}
		break
	case 403:
		alert("Falscher Nutzer oder falsches Passwort")
		break
	case 404:
		break
	case 406:
		alert("Dein Name scheint nicht, oder mehrfach vergeben zu sein, bitte genauer angeben. Sollte das Problem weiterhin bestehen, bitte melden.")
		break
	default:
	case 500: {
		// possible issue due to an update, try to renew SW to load update
		const registration = await navigator.serviceWorker?.getRegistration()
		if(registration?.waiting){
			registration?.waiting?.postMessage("SKIP_WAITING")
			window.location.reload()
		}
		break
	}
	case 503:
		alert("Server nicht erreichbar. Bitte versuche es später erneut.")
		break
	}

	return { _forename, _surname, _api_token, _auth_level, _theme, _secure }
}

const update_login = async (version) => {
	let _forename, _surname, _auth_level, _theme, error, permissions
	let _secure = true

	let displayMode = getDisplayMode()
	let device_id = await getDeviceID()
	let preferences = await getDevicePreferences()
    
	let token = localStorage.getItem("api_token")
	if(!Object.is(token, null)){
		let body = JSON.stringify({
			Version: version,
			Token: token,
			DisplayMode: displayMode,
			Engine: navigator.userAgent.match(/([A-Z][a-z]*)+\/\d+[.\d+]*/g).toString(),
			Device: navigator.userAgent.match(/(\([^(]+(\n[^(]+)*\))/g)[0],
			Dimension: `${window.innerWidth}x${window.innerHeight}`,
			DeviceUUID: device_id,
			Notification: getDeviceNotificationPermission(),
			Preferences: preferences
		})
		let response = await fetch(`${host}/api/login.php?mode=update&body=` + body)
		switch(response.status) {
		case 200:
			if (response.headers.get("Content-Type") === "application/json") {
				let json = await response.json()
				_forename = json.Forename
				_surname = json.Surname
				_auth_level = json.Auth_level
				_theme = json.Theme
				error = json.Err
				permissions = json.Permissions
				if(error === 4){
					_secure = false
				}
				localStorage.setItem("api_token", token)
				localStorage.setItem("auth_level", _auth_level)
				localStorage.setItem("permissions", JSON.stringify(permissions))
			} else {
				response.text().then(text => {
					sendError(text)
				})
			}
			break
		case 204:
			// the stored token is invalid, clear local storage
			localStorage.clear()
			break
		case 404:
			break
		default:
		case 500: {
			// possible issue due to an update, try to renew SW to load update
			const registration = await navigator.serviceWorker?.getRegistration()
			registration?.waiting?.postMessage("SKIP_WAITING")
			break
		}
		case 503:
			alert("Server nicht erreichbar. Bitte versuche es später erneut.")
			break
		}
	}
	return { _forename, _surname, _auth_level, _theme, _secure }
}

const getEvent = async (event_id) => {
	let event
	let token = localStorage.getItem("api_token")

    
	if (event_id > 0) {
		let response = await fetch(`${host}/api/v0/events/${event_id}?api_token=${token}`, {method: "GET"})

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
	let token = localStorage.getItem("api_token")
	let url = `${host}/api/v0/events?api_token=${token}`
	switch(filter){
	case "current":
		url += "&current"
		break
	case "past":
		url += "&past"
		break
	default:
		break
	}

	return fetch(url, {
		method: "GET",
		mode: "cors"
	}).then(response => {
		switch(response.status){
		case 200:
			return response.json()
		default:
			break
		}
	}).then(json => {
		return json
	})
}

const updateEvent = async(event_id, category, state, type, location, address, date, begin, end, departure, leave_dep, plusone, usergroup, clothing, fixed, push) => {
	let token = localStorage.getItem("api_token")
	let response = await fetch(`${host}/api/v0/events/${event_id}?api_token=${token}`, {
		method: "PUT",
		mode: "cors",
		body: JSON.stringify({
			Event_ID: event_id,
			Category: category,
			State: state,
			Type: type,
			Location: location,
			Address: address,
			Date: date,
			Begin: begin === "" ? null : begin,
			End: end,
			Departure: departure === "" ? null : departure,
			Leave_dep: leave_dep === "" ? null : leave_dep,
			Accepted: true,
			PlusOne: plusone,
			Usergroup_ID: usergroup,
			Clothing: clothing,
			Fixed: fixed,
			Push: push
		})
	})
	switch(response.status){
	case 200:
		alert("Angaben übernommen")
		return true
	default:
		alert("Ein Fehler ist aufgetreten")
		return false
	}
}

const newEvent = async (category, state, type, location, address, date, begin, end, departure, leave_dep, plusone, usergroup, clothing, fixed, push) => {
    
	let token = localStorage.getItem("api_token")
    
	let response = await fetch(`${host}/api/v0/events?api_token=${token}`, {
		method: "POST",
		body: JSON.stringify({
			Category: category,
			State: state,
			Type: type,
			Location: location,
			Address: address,
			Date: date,
			Begin: begin === "" ? null : begin,
			End: end,
			Departure: departure === "" ? null : departure,
			Leave_dep: leave_dep === "" ? null : leave_dep,
			Accepted: true, // dummy, kept for compatibility
			PlusOne: plusone,
			Usergroup_ID: usergroup,
			Clothing: clothing,
			Fixed: fixed,
			Push: push
		})
	})
	switch(response.status){
	case 201:
		return true
	default:
		return false
	}
}

const setAttendence = async (event_id, member_id, attendence, plusone) => {

	let token = localStorage.getItem("api_token")

	await fetch(`${host}/api/v0/attendence/${event_id}?api_token=${token}`, {
		method: "PATCH",
		body: JSON.stringify({
			Member_ID: member_id,
			Attendence: attendence,
			PlusOne: plusone
		})
	}).then(response => {
		switch(response.status){
		case 200:
			break
		default:
			alert("Ein Fehler ist aufgetreten")
			break
		}
	})
}

const getAttendences = async () => {    
	let token = localStorage.getItem("api_token")
  
	return fetch(`${host}/api/v0/attendence?api_token=${token}`)
		.then(response => {
			return response.json()
		}).then(json => {
			return json
		}, error => {
			sendError(error)
			return new Array(0)
		})
}

export const getAllAttendences = async (usergroup_id) => {
	let attendences = new Array(0)
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/v0/attendence?api_token=${token}&all=true&usergroup_id=${usergroup_id}`, {
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

export const updateAttendence = async (event_id, attendence, plusone) => {
	let token = localStorage.getItem("api_token")

	await fetch(`${host}/api/v0/attendence/${event_id}?api_token=${token}`, {
		method: "PATCH",
		body: JSON.stringify({
			Attendence: attendence,
			PlusOne: plusone
		})
	}).then(response => {
		switch(response.status){
		case 200:
			break
		default:
			alert("Ein Fehler ist aufgetreten")
			break
		}
	})
}

const getEvalByUsergroup = async (usergroup_id) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/eval.php?api_token=${token}&usergroup=${usergroup_id}&events`, {
		method: "GET"
	})
	switch(response.status){
	case 200:
		return await response.json()
	default:
		return
	}    
}

/**
 * Absence
 */

export const getAbsence = async (absence_id) => {
    
	if(absence_id === -1)
		return

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/absence.php?id=${absence_id}&api_token=${token}`, {
		method: "GET"
	})
	switch(response.status){
	case 200:
		return await response.json()
	default:
		return
	}
}

export const getAbsences = async (filter) => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/absence.php?api_token=${token}&filter=${filter}`, {
		method: "GET"
	})
	switch(response.status){
	case 200:
		return await response.json()
	default:
		return
	}
}

export const updateAbsence = async (absence_id, member_id, from, until, info) => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/absence.php?api_token=${token}&id=${absence_id}`, {
		method: "PUT",
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
		alert("ein Fehler ist aufgetreten")
	}
}

export const newAbsence = async (from, until, info) => {

	let token = localStorage.getItem("api_token")

       let response = await fetch(`${host}/api/absence.php?api_token=${token}`, {
               method: "POST",
               headers: {
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
		break
	default:
		alert("ein Fehler ist aufgetreten")
		break
	}
}

export const newManualAbsence = async (member_id, from, until, info) => {
    
	let token = localStorage.getItem("api_token")

       let response = await fetch(`${host}/api/absence.php?api_token=${token}`, {
               method: "POST",
               headers: {
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
		alert("Abwesenheit eingetragen")
		break
	default:
		alert("Ein Fehler ist aufgetreten")
		break
	}
}

export const deleteAbsence = async (absence_id) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/absence.php?api_token=${token}&id=${absence_id}`, {
		method: "DELETE"
	})
	switch(response.status){
	case 204:
		alert("gelöscht")
		break
	case 404:
		alert("Abwesenheit nicht vorhanden")
		break
	default:
		alert("ein Fehler ist aufgetreten")
		break
	}
}

export const getAllAbsences = async (filter) => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/absence.php?api_token=${token}&filter=${filter}&all`, {
		method: "GET"
	})
	switch(response.status){
	case 200:
		return await response.json()
	default:
		return
	}
}

export const newUsergroup = async (title, admin, moderator, info, association) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/usergroup.php?api_token=${token}`, {
		method: "POST",
		body: JSON.stringify({
			Title:          title,
			Admin:          admin,
			Moderator:      moderator,
			Info:           info,
			Association_ID: parseInt(association)
		})
	})

	switch(response.status){
	case 201:
		alert("Nutzergruppe erstellt")
		break
	default:
		alert("Ein fehler ist aufgetreten")
		break
	}
}

export const updateUsergroup = async (usergroup_id, title, admin, moderator, info, association) => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&id=${usergroup_id}`, {
		method: "PUT",
		body: JSON.stringify({
			Title:          title,
			Admin:          admin,
			Moderator:      moderator,
			Info:           info,
			Association_ID: parseInt(association)
		})
	})

	switch(response.status){
	case 200:
		alert("Nutzergruppe aktualisiert")
		break
	default:
		alert("Ein fehler ist aufgetreten")
		break
	}
}

export const deleteUsergroup = async (usergroup_id) => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&id=${usergroup_id}`, {
		method: "DELETE"
	})

	switch(response.status){
	case 204:
		alert("Nutzergruppe gelöscht")
		break
	default:
		alert("Ein fehler ist aufgetreten")
		break
	}

}

export const getUsergroup = async (usergroup_id) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&id=${usergroup_id}`, {
		method: "GET"
	})

	switch(response.status){
	case 200:
		return await response.json()
	default:
		break
	}
}

export const getUsergroups = async () => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&search`, {
		method: "GET"
	})

	switch(response.status){
	case 200:
		return await response.json()
	default:
		break
	}
}

export const getOwnUsergroups = async () => {
    
	let token = localStorage.getItem("api_token")

	let lastmodified = JSON.parse(localStorage.getItem("own_usergroups"))?.lastmodified
	let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&own=${true}`, {
		method: "GET",
		headers: lastmodified ? {
			"If-Modified-Since": lastmodified
		} : {}
	})

	let json
	switch(response.status){
	case 200: {
		json = await response.json()
		let store = {
			lastmodified: response.headers.get("DB-Last-Modified"),
			data: json
		}
		localStorage.setItem("own_usergroups", JSON.stringify(store))
		break
	}
	case 304:
		json = JSON.parse(localStorage.getItem("own_usergroups"))?.data
		break
	default:
		break
	}
	return json
}

export const getUsergroupAssignments = async() => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&array`, {
		method: "GET"
	})

	switch(response.status){
	case 200:
		return await response.json()
	default:
		break
	}
}

export const updateUsergroupAssignments = async (changedAssignments) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/usergroup.php?api_token=${token}&assign`, {
		method: "PUT",
		body: JSON.stringify(changedAssignments)
	})

	switch(response.status){
	case 200:
		alert("Zuweisungen übernommen")
		break
	default:
		alert("Zuweisung fehlgeschlagen")
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
export const newDateTemplate = async (title, description, category, type, location, begin, departure, leave_dep, usergroup_id) => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/datetemplate.php?api_token=${token}`, {
		method: "POST",
		body: JSON.stringify({
			Title           : title,
			Description     : description,
			Category        : category,
			Type            : type,
			Location        : location,
			Begin           : begin === "" ? null : begin,
			Departure       : departure === "" ? null : departure,
			Leave_dep       : leave_dep === "" ? null : leave_dep,
			Usergroup_ID    : usergroup_id
		})
	})

	switch(response.status){
	case 201:
		alert("Vorlage erstellt")
		break
	default:
		alert("Ein Fehler ist aufgetreten")
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
export const updateDateTemplate = async (template_id, title, description, category, type, location, begin, departure, leave_dep, usergroup_id) => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/datetemplate.php?api_token=${token}&template_id=${template_id}`, {
		method: "PUT",
		body: JSON.stringify({
			Title           : title,
			Description     : description,
			Category        : category,
			Type            : type,
			Location        : location,
			Begin           : begin === "" ? null : begin,
			Departure       : departure === "" ? null : departure,
			Leave_dep       : leave_dep === "" ? null : leave_dep,
			Usergroup_ID    : usergroup_id
		})
	})

	switch(response.status){
	case 200:
		alert("Vorlage gespeichert")
		break
	default:
		alert("Ein Fehler ist aufgetreten")
		break
	}
}

export const getDateTemplates = async () => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/datetemplate.php?api_token=${token}`, {
		method: "GET"
	})

	switch(response.status){
	case 200:
		return await response.json()
	default:
		break
	}
}

export const newAssociation = async (title, firstchair, clerk, treasurer) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/association.php?api_token=${token}`, {
		method: "POST",
		body: JSON.stringify({
			Title:      title,
			FirstChair: firstchair,
			Clerk:      clerk,
			Treasurer:  treasurer
		})
	})

	switch(response.status){
	case 201:
		alert("Verein erstellt")
		break
	default:
		alert("Ein Fehler ist aufgetreten")
		break
	}
}

export const updateAssociation = async (id, title, firstchair, clerk, treasurer) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/association.php?api_token=${token}&id=${id}`, {
		method: "PUT",
		body: JSON.stringify({
			Title:      title,
			FirstChair: firstchair,
			Clerk:      clerk,
			Treasurer:  treasurer
		})
	})

	switch(response.status){
	case 200:
		alert("Änderungen übernommen")
		break
	default:
		alert("Ein Fehler ist aufgetreten")
		break
	}
}

export const getAssociations = async () => {
    
	let token = localStorage.getItem("api_token")
	let associations = new Array(0)

	let lastmodified = JSON.parse(localStorage.getItem("associations"))?.lastmodified
	let response = await fetch(`${host}/api/association.php?api_token=${token}`, {
		method: "GET",
		headers: lastmodified ? {
			"If-Modified-Since": lastmodified
		} : {}
	})

	switch(response.status){
	case 200:
		associations = await response.json()
		break
	default:
	case 204:
		break
	}

	return associations
}

export const getWeather = async (nextEvent) => {
	let temperature, weathercode
	let interval = "hourly"
	let hour = nextEvent.Begin === null ? 12 : parseInt(nextEvent.Begin.slice(0,2))
	let quarter = nextEvent.Begin === null ? 0 : Math.round(parseInt(nextEvent.Begin.slice(3,5)) / 15)

	// check if the event is in the next 48 hours
	let now = new Date()
	let eventDate = new Date(nextEvent.Date)
	eventDate.setHours(hour)
	eventDate.setMinutes(quarter * 15)

	// check if the event is in the past, allow for 15 minutes of delay
	if(eventDate.getTime() - now.getTime() < -900000)
		return

	if(eventDate.getTime() - now.getTime() < 172800000) // event is less than 48 hours in the future
		interval = "minutely_15" // get weather with higher resolution

	let geo
	if(nextEvent.Address !== "")
		geo = await maptilerClient.geocoding.forward(nextEvent.Address)
	else
		geo = await maptilerClient.geocoding.forward(nextEvent.Location)

	if (geo.features.length === 0)
		return
    
	let response = await fetch(`https://api.open-meteo.com/v1/dwd-icon?latitude=${geo.features[0].center[1]}&longitude=${geo.features[0].center[0]}&${interval}=apparent_temperature,weathercode&start_date=${nextEvent.Date}&end_date=${nextEvent.Date}&timezone=CET`)
	let json = await response.json()

	if(interval === "minutely_15"){
		temperature = json.minutely_15.apparent_temperature[hour * 4 + quarter]
		weathercode = json.minutely_15.weathercode[hour * 4 + quarter]
	} else {
		temperature = json.hourly.apparent_temperature[hour]
		weathercode = json.hourly.weathercode[hour]
	}

	return({
		"Temperature": temperature,
		"Weathercode": weathercode
	})
}

export const getScores = async () => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/score.php?api_token=${token}`, {
		method: "GET"
	})

	switch(response.status){
	case 200:
		return await response.json()
	case 204:
		return(new Array(0))
	default:
		alert("Ein Fehler ist aufgetreten")
		break
	}
}

export const newScore = async (title, link) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/score.php?api_token=${token}`, {
		method: "POST",
		body: JSON.stringify({
			Title:  title,
			Link:   link
		})
	})

	switch(response.status){
	case 201:
		alert("Notenverweis erstellt")
		break
	default:
		alert("Ein Fehler ist aufgetreten")
		break
	}
}

export const updateScore = async (score_id, title, link) => {

	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/score.php?api_token=${token}&id=${score_id}`, {
		method: "PUT",
		body: JSON.stringify({
			Title:  title,
			Link:   link
		})
	})

	switch(response.status){
	case 200:
		alert("Notenverweis erstellt")
		break
	default:
		alert("Ein Fehler ist aufgetreten")
		break
	}
}

export const deleteScore = async (score_id) => {
    
	let token = localStorage.getItem("api_token")
	let response = await fetch(`${host}/api/score.php?api_token=${token}&id=${score_id}`, {
		method: "DELETE"
	})

	switch(response.status){
	case 204:
		alert("Notenverweis gelöscht")
		break
	default:
		alert("Ein Fehler ist aufgetreten")
		break
	}
}

export const newFeedback = async (content) => {
	let token = localStorage.getItem("api_token")
	fetch(`${host}/api/feedback.php?api_token=${token}`, {
		method: "POST",
		body: JSON.stringify({
			Content: content
		})
	})
}

export const getAssociationAssignments = async () => {
	let token = localStorage.getItem("api_token")
	let json = fetch(`${host}/api/association.php?api_token=${token}&assign`)
		.then(response => {
			return response.json()
		}).then(json => {
			return json
		})
	return json
}

export const updateAssociationAssignments = async (changedAssignments) => {
    
	let token = localStorage.getItem("api_token")

	let response = await fetch(`${host}/api/association.php?api_token=${token}&assign`, {
		method: "PUT",
		body: JSON.stringify(changedAssignments)
	})

	switch(response.status){
	case 200:
		alert("Zuweisungen übernommen")
		break
	default:
		alert("Zuweisung fehlgeschlagen")
		break
	}
}

export const sendPushSubscription = async (subscription, allowed) => {
	let token = localStorage.getItem("api_token")
	let permissions
	subscription.allowed = allowed
	localStorage.setItem("endpoint", subscription.endpoint)    
	await fetch(`${host}/api/pushsubscription.php?api_token=${token}`, {
		method: "PUT",
		body: JSON.stringify(subscription)
	})

	await fetch(`${host}/api/pushsubscription.php?api_token=${token}&endpoint=${subscription.endpoint}`)
		.then(response => {
			if(response.status === 200){
				return response.json()
			}
		}).then(json => {
			permissions = json
		})

	return permissions
}

export { login, update_login, getEvent, getEvents, updateEvent, newEvent, setAttendence, getAttendences, getEvalByUsergroup }
