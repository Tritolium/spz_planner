import { lazy, Suspense, useCallback, useEffect } from 'react'
import { useState } from 'react'
import { getAttendences, getBirthdates, getWeather, getDisplayMode, getOS, newFeedback, updateAttendences, getEvalByEvent } from '../../modules/data/DBConnect'
import { StyledChangelog, StyledDashboard, StyledFeedbackArea, StyledInfoText } from './Dashboard.styled'
import { Clothing } from '../../modules/components/clothing/Clothing'
import { TbAlertTriangle } from 'react-icons/tb'
import { theme } from '../../theme'
import { IoShareOutline } from 'react-icons/io5'
import { BsPlusSquare } from 'react-icons/bs'
import { beforeInstallPrompt } from '../..'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
import { Bar } from "react-chartjs-2"
import { version } from '../../App'

const Button = lazy(() => import('../../modules/components/button/Button'))
const Terminzusage = lazy(() => import('../dateplanner/attendenceInput/Terminzusage'))
const WeatherIcon = lazy(() => import('./WeatherIcon'))

const Dashboard = ({ fullname, auth_level }) => {

    const [nextEvents, setNextEvents] = useState(new Array(0))
    const [nextPractices, setNextPractices] = useState(new Array(0))
    const [showiosInstruction, setShowiosInstruction] = useState(false)
    const [mobileBrowser, setMobileBrowser] = useState(false)
    // const mobileBrowser = (getDisplayMode() === 'browser tab' && window.innerWidth < parseInt(theme.medium.split('px')[0]))    

    const getNextEvent = async () => {
        let events = await getAttendences()
        let nextAll = events.filter((event1, event2) => { //  out past events, if cache contains them
            if(event1.Date < event2.Date)
                return 1
            else if(event1.Date===event2.Date)
                return event1.Begin < event2.Begin
            else
                return -1
        })

        let nextEvent = nextAll.filter(event => { // sort out practice
            return !(event.Type.toLowerCase().includes('probe') || event.Type.toLowerCase().includes('üben'))
        })[0]

        let nextEvents = nextAll.filter(event => { // sort out practice
            return !(event.Type.toLowerCase().includes('probe') || event.Type.toLowerCase().includes('üben'))
        }).filter(event => { //sort out events too far from event_0
            let nextDate = new Date(nextEvent.Date)
            let eventDate = new Date(event.Date)
            if(eventDate.getTime() === nextDate.getTime())
                return true
            eventDate.setDate(eventDate.getDate() - 1)
            if(eventDate.getTime() === nextDate.getTime())
                return true
                eventDate.setDate(eventDate.getDate() - 1)
            if(eventDate.getTime() === nextDate.getTime())
                return true
            return false
        })

        let nextPractice = nextAll.filter(event => { // sort out practice
            return event.Type.toLowerCase().includes('probe') || event.Type.toLowerCase().includes('üben')
        })[0]



        let nextPractices = nextAll.filter(event => { // sort out practice
            return event.Type.toLowerCase().includes('probe') || event.Type.toLowerCase().includes('üben')
        }).filter(event => { //sort out practices too far from event_0
            let nextDate = new Date(nextPractice.Date)
            let eventDate = new Date(event.Date)
            if(eventDate.getTime() === nextDate.getTime())
                return true
            eventDate.setDate(eventDate.getDate() - 1)
            if(eventDate.getTime() === nextDate.getTime())
                return true
                eventDate.setDate(eventDate.getDate() - 1)
            if(eventDate.getTime() === nextDate.getTime())
                return true
            return false
        })

        setNextEvents(nextEvents)
        setNextPractices(nextPractices)
    }

    const showInstall = () => {
        let os = getOS()
        if(os !== 'Mac OS' && os !== 'iOS'){
            beforeInstallPrompt.prompt()
        } else {
            setShowiosInstruction(true)
            setMobileBrowser(false)
        }
    }

    useEffect(() => {
        getNextEvent()
        let os = getOS()
        setMobileBrowser((getDisplayMode() === 'browser tab' && window.innerWidth < parseInt(theme.medium.split('px')[0]) && (beforeInstallPrompt || !(os !== 'Mac OS' && os !== 'iOS'))))
    }, [])

    return(<StyledDashboard>
        {mobileBrowser ? <StyledInfoText>
            <TbAlertTriangle onClick={showInstall}/>
        </StyledInfoText> : <></>}
        {mobileBrowser ? <StyledInfoText>Diese App kann auch installiert werden, einfach auf das Icon klicken!</StyledInfoText> : <></>}
        {showiosInstruction ? <StyledInfoText className='iosInstruction'>Erst <IoShareOutline />, dann <BsPlusSquare /></StyledInfoText> : <></>}
        <Changelog read={localStorage.getItem("changelogRead") === version}/>
        <BirthdayBlog fullname={fullname}/>
        <table>
            <tbody>
                <Suspense>
                    {nextPractices.length > 0 ? <tr><th colSpan={3}>Nächste Probe{nextPractices.length > 1 ? "n" : ""}:</th></tr> : <></>}
                    {nextPractices.length > 0 ? nextPractices.map(nextPractice => {return(<NextPractice nextPractice={nextPractice} key={`nextPractice_${nextPractice.Event_ID}`} auth_level={auth_level}/>)}) : <></>}
                </Suspense>
                <Suspense>
                    {nextEvents.length > 0 ? <tr><th colSpan={3}>Nächste{nextEvents.length === 1 ? "r" : ""} Termin{nextEvents.length > 1 ? "e" : ""}:</th></tr> : <></>}
                    {nextEvents.length > 0 ? nextEvents.map(nextEvent => {return(<NextEvent nextEvent={nextEvent} key={`nextEvent_${nextEvent.Event_ID}`} auth_level={auth_level}/>)}) : <></>}
                </Suspense>
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
                let now = new Date()
                date.setFullYear(now.getFullYear())
                let diff = date.getTime() - now.getTime()
                return (-604800000 < diff && diff < 604800000)
            }).sort((bday_a, bday_b) => {
                let date_a = new Date(bday_a.Birthday)
                let date_b = new Date(bday_b.Birthday)

                if(date_a.getMonth() < date_b.getMonth()){
                    return -1
                } else if(date_a.getMonth() > date_b.getMonth()){
                    return 1
                } else {
                    if(date_a.getDate() < date_b.getDate()){
                        return -1
                    } else if(date_a.getDate() > date_b.getDate()){
                        return 1
                    } else {
                        return 0
                    }
                }
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
                let same = today.getDate() === birthday.getDate()
                if(fullname === bday.Fullname && same)
                    return(<div>Herzlichen Glückwunsch, {fullname.split(" ")[0]}!</div>)
                else
                    return(<div key={bday.Fullname}>{bday.Fullname}: {birthday.getDate()}.{birthday.getMonth() + 1}, {today.getFullYear() - birthday.getFullYear()} Jahre</div>)
            })}
        </div>)
    }
}

const Changelog = ({read}) => {
    const [clicked, setClicked] = useState(false)

    const onClick = () => {
        setClicked(true)
        localStorage.setItem("changelogRead", version)
    }

    return(
        <StyledChangelog id="changelog">
            {!(read || clicked) ? <Button onClick={onClick}>Änderungen verbergen</Button> : <></>}
            {!(read || clicked) ? 
                <>
                    <h2>Neu in {version}:</h2>
                    <ul>
                        <li>
                            <i>Benachrichtigungen:</i> Mit der Glocke oben rechts können Benachrichtigungen aktiviert werden. Vorraussetzung ist, dass die App "installiert" ist.
                        </li>
                        <li>
                            <i>Passwörter:</i> Der Zugang kann jetzt mit einem Passwort versehen werden. Unter Einstellung setzen oder verändern.
                        </li>
                        <li>
                            <i>Startseite:</i> Das Layout der Startseite wurde angepasst und erweitert.
                        </li>
                    </ul>
                </>
                : <></>
            }
        </StyledChangelog>
    )
}

const ClothingRow = ({ clothing }) => {

    return(
        <Suspense>
            {parseInt(clothing) !== 0 ? <tr>
                <td>Bekleidung:</td>
                <td><Clothing clothing={parseInt(clothing)} /></td>
            </tr> : <></>}
        </Suspense>
    )
}

const NextPractice = ({ nextPractice, auth_level }) => {

    const [evaluation, setEvaluation] = useState()

    let practiceDate = new Date(nextPractice?.Date)
    let attendence = nextPractice?.Attendence

    useEffect(() => {
        if(nextPractice !== undefined){
            getEvalByEvent(nextPractice?.Event_ID, nextPractice?.Usergroup_ID).then(evaluation => {
                setEvaluation(evaluation)
            })
        }
    }, [nextPractice])

    const onClick = (event_id, att) => {
        let changes = {}
        changes['' + event_id] = att
        updateAttendences(changes, false)
    }

    return(<>
        <tr className='event_header'>
            <td>{nextPractice?.Type}</td>
            <td>{nextPractice?.Location}</td>
            <td rowSpan={2}><Terminzusage event_id={nextPractice?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={nextPractice?.Type.includes('Abgesagt')}/></td>
        </tr>
        <tr>
            <td>{practiceDate.getDate()}.{practiceDate.getMonth() + 1}.{practiceDate.getFullYear()}</td>
            <td>{nextPractice?.Begin.slice(0, 5)} Uhr</td>
        </tr>
        <tr>
            {auth_level > 1 ? <td colSpan={3}><DashboardDiagram event={evaluation} auth_level={auth_level}/></td> : <></>}
        </tr>
    </>)
}

const NextEvent = ({ nextEvent, auth_level }) => {

    const [weather, setWeather] = useState()
    const [evaluation, setEvaluation] = useState()

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
        if(nextEvent !== undefined){
            getEvalByEvent(nextEvent?.Event_ID, nextEvent?.Usergroup_ID).then(evaluation => {
                setEvaluation(evaluation)
            })
        }
    }, [nextEvent])

    const onClick = (event_id, att) => {
        let changes = {}
        changes['' + event_id] = att
        updateAttendences(changes, false)
    }

    return(<>
        <tr className='event_header'>
            <td>{nextEvent?.Type}</td>
            <td>{nextEvent?.Location}</td>
        </tr>
        <tr>
            <td>{eventDate.getDate()}.{eventDate.getMonth() + 1}.{eventDate.getFullYear()}</td>
            <td>{nextEvent?.Begin !== "12:34:56" ? `${nextEvent?.Begin.slice(0, 5)} Uhr` : "-"}</td>
            <td rowSpan={3}><Suspense><Terminzusage event_id={nextEvent?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={nextPractice?.Type.includes('Abgesagt')}/></Suspense></td>
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
        {weather ? <Suspense>
            <tr>
                <td>Wetter:</td>
                <td>{`${weather.Temperature}°C`}</td>
                <td><WeatherIcon code={weather.Weathercode} /></td>
            </tr>
        </Suspense> : <></>}
        <tr>
            {auth_level > 0 ? <td colSpan={3}><DashboardDiagram event={evaluation} auth_level={auth_level}/></td> : <></>}
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
            <StyledFeedbackArea aria-label="Feedback-Feld" open={open} name="content" id="feedbackcontent" cols="30" rows="10"></StyledFeedbackArea>
        </form>
    </div>)
}

const DashboardDiagram = ({ event, auth_level }) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    )

    const options = {
        animation: {
            duration: 0
        },
        indexAxis: 'y',
        plugins: {
            title: {
                display: false
            },
            legend: {
                display: false
            },
            tooltip: {
                enabled: auth_level > 1
            }
        },
        scales: {
            x: {
                stacked: true,
                display: false
            },
            y: {
                stacked: true,
                display: false
            }
        }
    }

    const labels = ['']

    const data = {
        labels,
        datasets: [
            {
                data: [event?.Consent],
                backgroundColor: theme.greenRGB
            },
            {
                data: [event?.Missing],
                backgroundColor: theme.blueRGB
            },
            {
                data: [event?.Maybe],
                backgroundColor: theme.yellowRGB
            },
            {
                data: [event?.Refusal],
                backgroundColor: theme.redRGB
            }
        ]
    }

    return(<Bar height={"30px"} options={options} data={data}/>)
}

export default Dashboard