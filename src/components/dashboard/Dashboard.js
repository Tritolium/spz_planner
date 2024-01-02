import { lazy, Suspense, useCallback, useEffect } from 'react'
import { useState } from 'react'
import { getAttendences, getBirthdates, getWeather, getDisplayMode, getOS, newFeedback, updateAttendences, getEvalByEvent } from '../../modules/data/DBConnect'
import { StyledChangelog, StyledDashboard, StyledFeedbackArea, StyledInfoText } from './Dashboard.styled'
import { Clothing } from '../../modules/components/clothing/Clothing'
import { TbAlertTriangle } from 'react-icons/tb'
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
import EventInfo from './EventInfo'
import Statistics from './Statistics'

const Button = lazy(() => import('../../modules/components/button/Button'))
const Terminzusage = lazy(() => import('../dateplanner/attendenceInput/Terminzusage'))
const WeatherIcon = lazy(() => import('./WeatherIcon'))

const Dashboard = ({ fullname, auth_level, theme }) => {

    const [nextEvents, setNextEvents] = useState(new Array(0))
    const [nextPractices, setNextPractices] = useState(new Array(0))
    const [nextOthers, setNextOthers] = useState(new Array(0))
    const [showiosInstruction, setShowiosInstruction] = useState(false)
    const [mobileBrowser, setMobileBrowser] = useState(false)
    const [eventInfo, setEventInfo] = useState(false)
    const [eventInfoData, setEventInfoData] = useState(undefined)

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

        let nextEvent = nextAll.filter(event => { // get only events
            return event.Category === "event"
        })[0]

        let nextEvents = nextAll
            .filter(event => event.Category === "event")
            .filter(event => {
                let nextDate = new Date(nextEvent.Date).getTime();
                let eventDate = new Date(event.Date);
                for(let i = 0; i < 3; i++) {
                    if(eventDate.getTime() === nextDate) return true;
                    eventDate.setDate(eventDate.getDate() - 1);
                }
                return false;
            });

        let nextPractice = nextAll.filter(event => { // get only practices
            return event.Category === "practice"
        })[0]

        let nextPractices = nextAll
            .filter(event => event.Category === "practice")
            .filter(event => {
                let nextDate = new Date(nextPractice.Date).getTime();
                let eventDate = new Date(event.Date);
                for(let i = 0; i < 3; i++) {
                    if(eventDate.getTime() === nextDate) return true;
                    eventDate.setDate(eventDate.getDate() - 1);
                }
                return false;
            });

        let nextOther = nextAll.filter(event => { // get only others
            return event.Category === "other"
        })[0]

        let nextOthers = nextAll
            .filter(event => event.Category === "other")
            .filter(event => {
                let nextDate = new Date(nextOther.Date).getTime();
                let eventDate = new Date(event.Date);
                for(let i = 0; i < 3; i++) {
                    if(eventDate.getTime() === nextDate) return true;
                    eventDate.setDate(eventDate.getDate() - 1);
                }
                return false;
            });

        setNextEvents(nextEvents)
        setNextPractices(nextPractices)
        setNextOthers(nextOthers)
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

    const showEventInfo = (eventData) => {
        setEventInfo(true)
        setEventInfoData(eventData)
    }

    const hideEventInfo = () => {
        setEventInfo(false)
    }

    useEffect(() => {
        getNextEvent()
        let os = getOS()
        setMobileBrowser((getDisplayMode() === 'browser tab' && window.innerWidth < parseInt(theme.medium.split('px')[0]) && (beforeInstallPrompt || !(os !== 'Mac OS' && os !== 'iOS'))))
    }, [theme.medium])

    return(<StyledDashboard id="Dashboard">
        {mobileBrowser ? <StyledInfoText>
            <TbAlertTriangle onClick={showInstall}/>
        </StyledInfoText> : <></>}
        {mobileBrowser ? <StyledInfoText>Diese App kann auch installiert werden, einfach auf das Icon klicken!</StyledInfoText> : <></>}
        {showiosInstruction ? <StyledInfoText className='iosInstruction'>Erst <IoShareOutline />, dann <BsPlusSquare /></StyledInfoText> : <></>}
        <Changelog read={localStorage.getItem("changelogRead") === version}/>
        {eventInfo ? <EventInfo hideEventInfo={hideEventInfo} eventInfoData={eventInfoData} fullname={fullname}/> : <DashboardAttendence fullname={fullname} nextPractices={nextPractices} nextEvents={nextEvents} nextOthers={nextOthers} showEventInfo={showEventInfo} auth_level={auth_level} theme={theme}/>}
        <Statistics theme={theme} auth_level={auth_level} />
        <Feedback />
    </StyledDashboard>)
}

const DashboardAttendence = ({ fullname, nextPractices, nextEvents, nextOthers, showEventInfo, auth_level, theme}) => {
    return(
        <div>
            <BirthdayBlog fullname={fullname}/>
            <table>
                <tbody>
                    <Suspense>
                        {nextPractices.length > 0 ? <tr><th colSpan={3}>Nächste Probe{nextPractices.length > 1 ? "n" : ""}:</th></tr> : <></>}
                        {nextPractices.length > 0 ? nextPractices.map(nextPractice => {return(<NextPractice nextPractice={nextPractice} key={`nextPractice_${nextPractice.Event_ID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme}/>)}) : <></>}
                    </Suspense>
                    <Suspense>
                        {nextEvents.length > 0 ? <tr><th colSpan={3}>Nächste{nextEvents.length === 1 ? "r" : ""} Auftritt{nextEvents.length > 1 ? "e" : ""}:</th></tr> : <></>}
                        {nextEvents.length > 0 ? nextEvents.map(nextEvent => {return(<NextEvent nextEvent={nextEvent} key={`nextEvent_${nextEvent.Event_ID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme}/>)}) : <></>}
                    </Suspense>
                    <Suspense>
                        {nextOthers.length > 0 ? <tr><th colSpan={3}>Nächste{nextOthers.length === 1 ? "r" : ""} Termin{nextOthers.length > 1 ? "e" : ""}:</th></tr> : <></>}
                        {nextOthers.length > 0 ? nextOthers.map(nextOther => {return(<NextOther nextOther={nextOther} key={`nextOther_${nextOther.Event_ID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme}/>)}) : <></>}
                    </Suspense>
                </tbody>
            </table>
        </div>
    )
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
                            <i>Startseite:</i>
                            Für die Termine auf der Startseite können weitere Informationen hinterlegt werden. Einfach auf den Termin tippen, um das Fenster zu öffnen.<br/>
                            Außerdem werden die Termine jetzt in drei Kategorien eingeteilt und angezeigt: Proben, Auftritte und sonstige Termine.
                        </li>
                        <li>
                            <i>Allgemein:</i> Benachrichtigungen können an- & abgeschaltet werden, entweder über die Glocke, oder über die Einstellungen. Dort ist auch die Unterscheidung zwischen Üben und Auftritt möglich.
                        </li>
                    </ul>
                </>
                : <></>
            }
        </StyledChangelog>
    )
}

const ClothingData = ({ clothing, onClick }) => {

    return(
        <Suspense>
            {parseInt(clothing) !== 0 ? <>
                <td onClick={onClick}>Bekleidung:</td>
                <td onClick={onClick}><Clothing clothing={parseInt(clothing)} /></td>
            </> : <><td colSpan={2}></td></>}
        </Suspense>
    )
}

const NextPractice = ({ nextPractice, auth_level, showEventInfo, theme }) => {

    const [evaluation, setEvaluation] = useState()

    let practiceDate = new Date(nextPractice?.Date)
    let attendence = nextPractice?.Attendence

    const onClick = async (event_id, att) => {
        let changes = {}
        changes['' + event_id] = att
        await updateAttendences(changes, false)
        updateEventEval()
    }

    const updateEventEval = useCallback(async () => {
        let _eval = await getEvalByEvent(nextPractice?.Event_ID, nextPractice?.Usergroup_ID)
        setEvaluation(_eval)
        return
    }, [nextPractice])

    const clickTD = useCallback(() => {
        showEventInfo(nextPractice)
    }, [showEventInfo, nextPractice])

    useEffect(() => {
        if(nextPractice !== undefined){
            updateEventEval()
        }
    }, [nextPractice, updateEventEval])

    useEffect(() => {
        const interval = setInterval(() => {
            updateEventEval()
        }, 60000);
        return () => clearInterval(interval);
      }, [updateEventEval]);

    return(<>
        <tr className='event_header'>
            <td onClick={clickTD}>{nextPractice?.Type}</td>
            <td onClick={clickTD}>{nextPractice?.Location}</td>
            <td rowSpan={2}><Terminzusage event={nextPractice} event_id={nextPractice?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={nextPractice?.Type.includes('Abgesagt')} theme={theme}/></td>
        </tr>
        <tr>
            <td onClick={clickTD}>{practiceDate.getDate()}.{practiceDate.getMonth() + 1}.{practiceDate.getFullYear()}</td>
            <td onClick={clickTD}>{nextPractice?.Begin === null ? '-' : `${nextPractice?.Begin.slice(0, 5)} Uhr`}</td>
        </tr>
        <tr>
            {auth_level > 1 ? <td colSpan={3}><DashboardDiagram event={evaluation} auth_level={auth_level} theme={theme}/></td> : <></>}
        </tr>
    </>)
}

const NextOther = ({ nextOther, auth_level, showEventInfo, theme }) => {

    const [weather, setWeather] = useState()
    const [evaluation, setEvaluation] = useState()

    let attendence = nextOther?.Attendence
    let gigDate = new Date(nextOther?.Date)

    const onClick = async (event_id, att) => {
        let changes = {}
        changes['' + event_id] = att
        await updateAttendences(changes, false)
        updateEventEval()
    }

    const updateEventEval = useCallback(async () => {
        let _eval = await getEvalByEvent(nextOther?.Event_ID, nextOther?.Usergroup_ID)
        setEvaluation(_eval)
        return
    }, [nextOther])

    const clickTD = useCallback(() => {
        showEventInfo(nextOther)
    }, [showEventInfo, nextOther])

    useEffect(() => {
        let eDate = new Date(nextOther?.Date)
        let nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 6)
        if(nextOther !== undefined && eDate < nextWeek) {
            getWeather(nextOther).then(weather => {
                setWeather(weather)
            })
        }
        if(nextOther !== undefined){
            updateEventEval()
        }
    }, [nextOther, updateEventEval])

    useEffect(() => {
        const interval = setInterval(() => {
            updateEventEval()
        }, 60000);
        return () => clearInterval(interval);
    }, [updateEventEval]);
    
    return(<>
        <tr className='event_header'>
            <td onClick={clickTD}>{nextOther?.Type}</td>
            <td onClick={clickTD}>{nextOther?.Location}</td>
        </tr>
        <tr>
            <td onClick={clickTD}>{gigDate.getDate()}.{gigDate.getMonth() + 1}.{gigDate.getFullYear()}</td>
            <td onClick={clickTD}>{nextOther?.Begin !== "12:34:56" && nextOther?.Begin !== null ? `${nextOther?.Begin.slice(0, 5)} Uhr` : "-"}</td>
            <td rowSpan={3}><Suspense><Terminzusage event={nextOther} event_id={nextOther?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={nextOther?.Type.includes('Abgesagt')} theme={theme}/></Suspense></td>
        </tr>
        <tr>
            <td onClick={clickTD}>Hin:</td>
            <td onClick={clickTD}>{nextOther?.Departure !== "12:34:56" && nextOther?.Departure !== null ? `${nextOther?.Departure.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <tr>
            <td onClick={clickTD}>Zurück:</td>
            <td onClick={clickTD}>{nextOther?.Leave_dep !== "12:34:56" && nextOther?.Leave_dep !== null ? `${nextOther?.Leave_dep.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <tr>
            <ClothingData  onClick={clickTD} clothing={nextOther?.Clothing} />
        </tr>
        {weather ? <Suspense>
            <tr>
                <td>Wetter:</td>
                <td>{`${weather.Temperature}°C`}</td>
                <td><WeatherIcon code={weather.Weathercode} /></td>
            </tr>
        </Suspense> : <></>}
        <tr>
            {auth_level > 0 ? <td colSpan={3}><DashboardDiagram event={evaluation} auth_level={auth_level} theme={theme}/></td> : <></>}
        </tr>
    </>)
}

const NextEvent = ({ nextEvent, auth_level, showEventInfo, theme }) => {

    const [weather, setWeather] = useState()
    const [evaluation, setEvaluation] = useState()

    let attendence = nextEvent?.Attendence
    let eventDate = new Date(nextEvent?.Date)

    const onClick = async (event_id, att) => {
        let changes = {}
        changes['' + event_id] = att
        await updateAttendences(changes, false)
        updateEventEval()
    }

    const updateEventEval = useCallback(async () => {
        let _eval = await getEvalByEvent(nextEvent?.Event_ID, nextEvent?.Usergroup_ID)
        setEvaluation(_eval)
        return
    }, [nextEvent])

    const clickTD = useCallback(() => {
        showEventInfo(nextEvent)
    }, [showEventInfo, nextEvent])

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
            updateEventEval()
        }
    }, [nextEvent, updateEventEval])

    useEffect(() => {
        const interval = setInterval(() => {
            updateEventEval()
        }, 60000);
        return () => clearInterval(interval);
      }, [updateEventEval]);

    return(<>
        <tr className='event_header'>
            <td onClick={clickTD}>{nextEvent?.Type}</td>
            <td onClick={clickTD}>{nextEvent?.Location}</td>
        </tr>
        <tr>
            <td onClick={clickTD}>{eventDate.getDate()}.{eventDate.getMonth() + 1}.{eventDate.getFullYear()}</td>
            <td onClick={clickTD}>{nextEvent?.Begin !== "12:34:56" && nextEvent?.Begin !== null ? `${nextEvent?.Begin.slice(0, 5)} Uhr` : "-"}</td>
            <td rowSpan={3}><Suspense><Terminzusage event={nextEvent} event_id={nextEvent?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={nextEvent?.Type.includes('Abgesagt')} theme={theme}/></Suspense></td>
        </tr>
        <tr>
            <td onClick={clickTD}>Hin:</td>
            <td onClick={clickTD}>{nextEvent?.Departure !== "12:34:56" && nextEvent?.Departure !== null ? `${nextEvent?.Departure.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <tr>
            <td onClick={clickTD}>Zurück:</td>
            <td onClick={clickTD}>{nextEvent?.Leave_dep !== "12:34:56" && nextEvent?.Leave_dep !== null ? `${nextEvent?.Leave_dep.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <tr>
            <ClothingData  onClick={clickTD} clothing={nextEvent?.Clothing} />
        </tr>
        {weather ? <Suspense>
            <tr>
                <td>Wetter:</td>
                <td>{`${weather.Temperature}°C`}</td>
                <td><WeatherIcon code={weather.Weathercode} /></td>
            </tr>
        </Suspense> : <></>}
        <tr>
            {auth_level > 0 ? <td colSpan={3}><DashboardDiagram event={evaluation} auth_level={auth_level} theme={theme}/></td> : <></>}
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

const DashboardDiagram = ({ event, auth_level, theme }) => {

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