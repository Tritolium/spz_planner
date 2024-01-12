import { lazy, Suspense, useCallback, useEffect } from 'react'
import { useState } from 'react'
import { getAttendences, getBirthdates, getDisplayMode, getOS, newFeedback } from '../../modules/data/DBConnect'
import { StyledDashboard, StyledFeedbackArea, StyledInfoText } from './Dashboard.styled'
import { TbAlertTriangle } from 'react-icons/tb'
import { IoShareOutline } from 'react-icons/io5'
import { BsPlusSquare } from 'react-icons/bs'
import { beforeInstallPrompt } from '../..'

import { version } from '../../App'
import EventInfo from './eventinfo/EventInfo'
import Statistics from './statistics/Statistics'
import NextEvent from './events/NextEvent'
import { Changelog } from './Changelog'

const Button = lazy(() => import('../../modules/components/button/Button'))

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
        <Changelog read={localStorage.getItem("changelogRead") === version} version={version}/>
        {eventInfo ? <EventInfo hideEventInfo={hideEventInfo} eventInfoData={eventInfoData} fullname={fullname}/> : <DashboardAttendence fullname={fullname} nextPractices={nextPractices} nextEvents={nextEvents} nextOthers={nextOthers} showEventInfo={showEventInfo} auth_level={auth_level} theme={theme}/>}
        <Statistics theme={theme} auth_level={auth_level} />
        <Feedback />
    </StyledDashboard>)
}

const DashboardAttendence = ({ fullname, nextPractices, nextEvents, nextOthers, showEventInfo, auth_level, theme}) => {
    return(
        <div>
            <BirthdayBlog fullname={fullname}/>
            <Suspense>
                {nextPractices.length > 0 ? <div className='event_header'>Nächste Probe{nextPractices.length > 1 ? "n" : ""}:</div> : <></>}
                {nextPractices.length > 0 ? nextPractices.map(nextPractice => {return(<NextEvent nextEvent={nextPractice} key={`nextPractice_${nextPractice.Event_ID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme} practice={true}/>)}) : <></>}
            </Suspense>
            <Suspense>
                {nextEvents.length > 0 ? <div className='event_header'>Nächste{nextEvents.length === 1 ? "r" : ""} Auftritt{nextEvents.length > 1 ? "e" : ""}:</div> : <></>}
                {nextEvents.length > 0 ? nextEvents.map(nextEvent => {return(<NextEvent nextEvent={nextEvent} key={`nextEvent_${nextEvent.Event_ID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme}/>)}) : <></>}
            </Suspense>
            <Suspense>
                {nextOthers.length > 0 ? <div className='event_header'>Nächste{nextOthers.length === 1 ? "r" : ""} Termin{nextOthers.length > 1 ? "e" : ""}:</div> : <></>}
                {nextOthers.length > 0 ? nextOthers.map(nextOther => {return(<NextEvent nextEvent={nextOther} key={`nextOther_${nextOther.Event_ID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme}/>)}) : <></>}
            </Suspense>
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
    if(birthdates?.length > 0){
        return(<div>
            <h3>Geburtstage:</h3>
            {birthdates?.map(bday => {
                let birthday = new Date(bday.Birthday)
                let today = new Date()
                let same = today.getDate() === birthday.getDate()
                if(fullname === bday.Fullname && same)
                    return(<div key={bday.Fullname}>Herzlichen Glückwunsch, {fullname.split(" ")[0]}!</div>)
                else
                    return(<div key={bday.Fullname}>{bday.Fullname}: {birthday.getDate()}.{birthday.getMonth() + 1}, {today.getFullYear() - birthday.getFullYear()} Jahre</div>)
            })}
        </div>)
    }

    return(<></>)
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



export default Dashboard