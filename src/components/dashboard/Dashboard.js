import { lazy, useCallback, useEffect } from 'react'
import { useState } from 'react'
import { getAttendences, getBirthdates, getWeather, newFeedback, updateAttendences } from '../../modules/data/DBConnect'
import { StyledDashboard, StyledFeedbackArea } from './Dashboard.styled'
// import Terminzusage from '../dateplanner/attendenceInput/Terminzusage'
// import WeatherIcon from './WeatherIcon'
// import Button from '../../modules/components/button/Button'
import { Clothing } from '../../modules/components/clothing/Clothing'

const Button = lazy(() => import('../../modules/components/button/Button'))
const Terminzusage = lazy(() => import('../dateplanner/attendenceInput/Terminzusage'))
const WeatherIcon = lazy(() => import('./WeatherIcon'))

const Dashboard = ({ fullname }) => {

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
            return !(event.Type.includes('Probe') || event.Type.includes('Üben'))
        })[0]

        let nextPractice = nextAll.filter(event => { // sort out practice
            return event.Type.includes('Probe') || event.Type.includes('Üben')
        })[0]

        setNextEvent(nextEvent)
        setNextPractice(nextPractice)
    }

    useEffect(() => {
        getNextEvent()     
    }, [])

    return(<StyledDashboard>
        <p className='infotext'>Info: die gesamten Rückmeldungen sind im Menü auf der linken Seite unter "Anwesenheiten" zu finden</p>
        <p className='infotext'>Auf dieser Seite ist das explizite speichern nicht mehr notwendig</p>
        <BirthdayBlog fullname={fullname}/>
        <table>
            <tbody>
                {nextPractice ? <NextPractice nextPractice={nextPractice} /> : <></>}
                {nextEvent ? <NextEvent nextEvent={nextEvent} /> : <></>}
            </tbody>
        </table>
        <Feedback />
    </StyledDashboard>)
}

const BirthdayBlog = ({ fullname }) => {
    const [birthdates, setBirthdates] = useState(new Array(0))

    const getBDates = async () => {
        getBirthdates().then(bdays => {
            let dates = bdays.filter(bday => {
                let date = new Date(bday.Birthday)
                date.setFullYear(2023)
                let now = new Date()
                let diff = date.getTime() - now.getTime()
                return (-604800000 < diff && diff < 604800000)
            })
            setBirthdates(dates)
    })
    }

    useEffect(() => {
        getBDates()
    }, [])
    if(birthdates.length > 0){
        return(<div>
            <h3>Geburtstage:</h3>
            {birthdates?.map(bday => {
                let birthday = new Date(bday.Birthday)
                let today = new Date()
                let same = today.getDay() === birthday.getDay()
                if(fullname === bday.Fullname && same)
                    return(<div>Herzlichen Glückwunsch, {fullname.split(" ")[0]}!</div>)
                else
                    return(<div key={bday.Fullname}>{bday.Fullname}: {birthday.getDay()}.{birthday.getMonth() + 1}, {today.getFullYear() - birthday.getFullYear()} Jahre</div>)
            })}
        </div>)
    }
}

const ClothingRow = ({ clothing }) => {

    return(
        <tr>
            <td>Bekleidung:</td>
            <td>{parseInt(clothing) !== 0 ? <Clothing clothing={parseInt(clothing)} /> : <>keine Angabe</>}</td>
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
            <td rowSpan={2}><Terminzusage event_id={nextPractice?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={nextPractice?.Type.includes('Abgesagt')}/></td>
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
        if(nextEvent !== undefined && eDate < nextWeek) {
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
        </tr>
        <tr>
            <td>Hin:</td>
            <td>{nextEvent?.Departure !== "12:34:56" ? `${nextEvent?.Departure.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <tr>
            <td>Zurück:</td>
            <td>{nextEvent?.Leave_dep !== "12:34:56" ? `${nextEvent?.Leave_dep.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <ClothingRow clothing={nextEvent?.Clothing} />
        <tr>
            <td>Wetter:</td>
            <td>{weather ? `${weather.Temperature}°C` : "keine Wetterdaten"}</td>
            <td>{weather ? <WeatherIcon code={weather.Weathercode} /> : ""}</td>
        </tr>

    </>)
}

const Feedback = () => {

    const [open, setOpen] = useState(false)

    const onClick = useCallback(() => {
        setOpen(!open)
        if(open){
            let content = document.getElementById('feedbackcontent').value
            newFeedback(content)
        }
        document.getElementById("feedbackform").reset()
    }, [open])

    const cancel = useCallback(() => {
        setOpen(false)
        document.getElementById("feedbackform").reset()
    }, [])

    return(<div>
        <div>
            <Button onClick={onClick}>{open ? "Senden" : "Feedback"}</Button>
            {open ? <Button onClick={cancel}>Abbrechen</Button> : <></>}
        </div>
        <form id="feedbackform">
            <StyledFeedbackArea open={open} name="content" id="feedbackcontent" cols="30" rows="10"></StyledFeedbackArea>
        </form>
    </div>)
}

export default Dashboard