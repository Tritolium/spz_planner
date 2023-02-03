import { useEffect } from 'react'
import { useState } from 'react'
import { getAttendences, getWeather, updateAttendences } from '../../modules/data/DBConnect'
import { StyledDashboard } from './Dashboard.styled'
import polo from '../../icons/polo.png'
import polod from '../../icons/polod.png'
import shirt from '../../icons//shirt.png'
import suit from '../../icons//suit.png'
import cow from '../../icons//cow.png'
import Terminzusage from '../dateplanner/attendenceInput/Terminzusage'

import rain from '../../icons/weather/rain.png'
import rainshower from '../../icons/weather/rainshower.png'

const Dashboard = () => {

    const [nextEvent, setNextEvent] = useState()
    const [nextPractice, setNextPractice] = useState()
    

    const getNextEvent = async () => {
        let events = await getAttendences()
        let nextAll = events.filter(event => { // sort out past events, if cache contains them
            let attDate = new Date(event.Date)
            attDate.setHours(23,59,59,999)
            let today = new Date()
            return today <= attDate
        })

        let nextEvent = nextAll.filter(event => { // sort out practice
            return !(event.Type === 'Probe' || event.Type === 'Üben')
        })[0]

        let nextPractice = nextAll.filter(event => { // sort out practice
            return event.Type === 'Probe' || event.Type === 'Üben'
        })[0]

        setNextEvent(nextEvent)
        setNextPractice(nextPractice)
    }

    useEffect(() => {
        getNextEvent()     
    }, [])

    return(<StyledDashboard>
        <div id='infotext'>Info: die gesamten Rückmeldungen sind im Menü auf der linken Seite unter "Anwesenheiten" zu finden</div>
        <table>
            <tbody>
                {nextPractice ? <NextPractice nextPractice={nextPractice} /> : <></>}
                {nextEvent ? <NextEvent nextEvent={nextEvent} /> : <></>}
            </tbody>
        </table>
    </StyledDashboard>)
}

const Clothing = ({ clothing }) => {

    let icon

    switch(clothing){
    case 1:
        icon = polo
        break
    case 2:
        icon = polod
        break
    case 3:
        icon = shirt
        break
    case 4:
        icon = suit
        break
    case 5:
        icon = cow
        break
    default:
        break
    }

    return(
        <tr>
            <td>Bekleidung:</td>
            <td>{icon ? <img src={icon} alt="Uniform" loading="lazy" /> : <>keine Angabe</>}</td>
        </tr>
    )
}

const NextPractice = ({ nextPractice }) => {

    let practiceDate = new Date(nextPractice?.Date)
    let attendence = nextPractice?.Attendence

    const onClick = (event_id, att) => {
        let changes = {}
        changes['' + event_id] = att
        updateAttendences(changes, false)
    }

    return(<>
        <tr>
            <th colSpan={3}>Nächste Probe:</th>
        </tr>
        <tr>
            <td>{nextPractice?.Type}</td>
            <td>{nextPractice?.Location}</td>
            <td rowSpan={2}><Terminzusage event_id={nextPractice?.Event_ID} states={3} attendence={attendence} onClick={onClick} /></td>
        </tr>
        <tr>
            <td>{practiceDate.getDate()}.{practiceDate.getMonth() + 1}.{practiceDate.getFullYear()}</td>
            <td>{nextPractice?.Begin.slice(0, 5)} Uhr</td>
        </tr>
    </>)
}

const NextEvent = ({ nextEvent }) => {

    const [weather, setWeather] = useState()

    let attendence = nextEvent?.Attendence
    let eventDate = new Date(nextEvent?.Date)
    

    useEffect(() => {
        let eDate = new Date(nextEvent?.Date)
        let nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 6)
        nextEvent.Latitude="50.17"
        nextEvent.Longitude="7.97"
        if(nextEvent !== undefined && eDate < nextWeek && nextEvent.Latitude !== undefined) {
            getWeather(nextEvent).then(weather => {
                setWeather(weather)
            })
        }
    }, [nextEvent])

    const onClick = (event_id, att) => {
        let changes = {}
        changes['' + event_id] = att
        updateAttendences(changes, false)
    }

    return(<>
        <tr>
            <th colSpan={3}>Nächster Termin:</th>
        </tr>
        <tr>
            <td>{nextEvent?.Type}</td>
            <td>{nextEvent?.Location}</td>
        </tr>
        <tr>
            <td>{eventDate.getDate()}.{eventDate.getMonth() + 1}.{eventDate.getFullYear()}</td>
            <td>{nextEvent?.Begin.slice(0, 5)} Uhr</td>
            <td rowSpan={3}><Terminzusage event_id={nextEvent?.Event_ID} states={3} attendence={attendence} onClick={onClick}/></td>
            <td rowSpan={3}>{weather ? `${weather.Temperature}°C` : "keine Wetterdaten"}</td>
            <td rowSpan={3}>{weather ? <WeatherIcon code={weather.Weathercode} /> : ""}</td>
        </tr>
        <tr>
            <td>Hin:</td>
            <td>{nextEvent?.Departure !== "12:34:56" ? `${nextEvent?.Departure.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <tr>
            <td>Zurück:</td>
            <td>{nextEvent?.Leave_dep !== "12:34:56" ? `${nextEvent?.Leave_dep.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <Clothing clothing={nextEvent?.Clothing} />
    </>)
}

const WeatherIcon = ({ code }) => {
    const icons = {
        0: "Klar",
        1: "Bewölkung, abnehmend",
        2: "Bewölkt",
        3: "Bewölkung, zunehmend",
        4: "Sicht reduziert durch Rauch",
        5: "Dunst",
        6: "Schwebender Staub",
        7: "Sand/Staub, gehoben",
        8: "Staubteufel",
        9: "Staub-/Sandsturm",
        10: "schwacher Nebel",
        11: "Nebelschwaden am Boden",
        12: "Durchgehend Bodennebel",
        13: "Wetterleuchten",
        14: "Niederschlag sichtbar, erreicht nicht den Boden",
        15: "Niederschlag in der Ferne, erreicht Boden",
        16: "Niederschlag in der Nähe, erreicht Boden",
        17: "Gewitter hörbar, kein Niederschlag",
        18: "Markante Windböen",
        19: "Tornado",
        20: "Nach Sprühregen",
        21: "Nach Regen",
        22: "Nach Schnee",
        23: "Nach Schneeregen",
        24: "Nach gefriedendem Regen",
        25: "Nach Regenschauern",
        26: "Nach Schneeschauern",
        27: "Nach Hagelschauern",
        28: "Nach Nebel",
        29: "Nach Gewitter",
        30: "Leichter/mäßiger Sandsturm, nachlassend",
        31: "Leichter/mäßiger Sandsturm, gleichbleibend",
        32: "Leichter/mäßiger Sandsturm, zunehmend",
        33: "Schwerer Sandsturm, nachlassend",
        34: "Schwerer Sandsturm, gleichbleibend",
        35: "Schwerer Sandsturm, zunehmend",
        36: "Leichtes/mäßiges Schneefegen",
        37: "Starkes Schneefegen",
        38: "Leichtes/mäßiges Schneetreiben",
        39: "Starkes Schneetreiben",
        40: "Nebel in der Ferne",
        41: "Nebelschwaden",
        42: "Nebel, Himmel sichtbar, abnehmend",
        43: "Nebel, Himmel verdeckt, abnehmend",
        44: "Nebel, Himmel sichtbar, gleichbleibend",
        45: "Nebel, Himmel verdeckt, gleichbleibend",
        46: "Nebel, Himmel sichtbar, zunehmend",
        47: "Nebel, Himmel verdeckt, zunehmend",
        48: "Raueis mit Nebel, Himmel sichtbar",
        49: "Raueis mit Nebel, Himmel verdeckt",
        50: "Leichter Sprühregen, unterbrochen",
        51: "Leichter Sprühregen, anhaltend", 
        52: "Mäßiger Sprühregen, unterbrochen",
        53: "Mäßiger Sprühregen, anhaltend",
        54: "Starker Sprühregen, unterbrochen",
        55: "Starker Sprühregen, anhaltend",
        56: "Gefrierender Sprühregen, leicht",
        57: "Gefrierender Sprühregen, mäßig/stark",
        58: "Leichter Regen und Sprühregen",
        59: "Mäßiger Regen und Sprühregen",
        60: "Leichter Regen, unterbrochen",
        61: <img src={rain} title='Leichter Regen, anhaltend'/>,
        62: "Mäßiger Regen, unterbrochen",
        63: "Mäßiger Regen, anhaltend",
        64: "Starker Regen, unterbrochen",
        65: "Starker Regen, anhaltend",
        66: "Gefrierender leichter Regen",
        67: "Gefrierender mäßiger/starker Regen",
        68: "Leichter Schneeregen",
        69: "Mäßiger/Starker Schneeregen",
        70: "Leichter Schneefall, unterbrochen",
        71: "Leichter Schneefall, anhaltend",
        72: "Mäßiger Schneefall, unterbrochen",
        73: "Mäßiger Schneefall, anhaltend",
        74: "Starker Schneefall, unterbrochen",
        75: "Starker Schneefall, anhaltend",
        76: "Eisnadeln",
        77: "Schneegriesel",
        78: "Schneekristalle",
        79: "Eiskörner",
        80: <img src={rainshower} title='Leichter Regenschauer'/>,
        81: "Starke Regenschauer",
        82: "Sintflutartige Regenschauer",
        83: "Leichte Schneeregenschauer",
        84: "Starke Schneeregenschauer",
        85: "Leichte Schneeschauer",
        86: "Starke Schneeschauer",
        87: "Leichte Graupelschauer",
        88: "Starke Graupelschauer",
        89: "Leichte Hagelschauer ohne Gewitter",
        90: "Starke Hagelschauer ohne Gewitter",
        91: "Leichter Regen, letzte Stunde Gewitter hörbar",
        92: "Starker Regen, letzte Stunde Gewitter hörbar",
        93: "Leichter Schnee/Regen-Hagel, letzte Stunde Gewitter hörbar",
        94: "Starker Schnee/Regen-Hagel, letzte Stunde Gewitter hörbar",
        95: "Leichtes/Mäßiges Gewitter mit Regen/Schnee",
        96: "Leichtes/Mäßiges Gewitter mit Hagel",
        97: "Schweres Gewitter mit Regen/Schnee",
        98: "Gewitter mit Sandsturm",
        99: "Schweres Gewitter mit Hagel"
    }

    if(icons[code] !== undefined)
        return icons[code]
    else
        return icons[~~(code/10) * 10]
}

export default Dashboard