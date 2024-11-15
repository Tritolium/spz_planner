import { lazy, Suspense, useCallback, useEffect, useRef } from 'react'
import { useState } from 'react'
import { getDisplayMode, host, newFeedback } from '../../modules/data/DBConnect'
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

    const [nextPracticeIDs, setNextPracticeIDs] = useState()
    const [nextEventIDs, setNextEventIDs] = useState()
    const [nextOtherIDs, setNextOtherIDs] = useState()
    const [fixedEventIDs, setFixedEventIDs] = useState()
    const [showiosInstruction, setShowiosInstruction] = useState(false)
    const [mobileBrowser, setMobileBrowser] = useState(false)
    const [eventInfo, setEventInfo] = useState(false)
    const [eventInfoData, setEventInfoData] = useState(undefined)

    const fixedEventIDsRef = useRef()

    const getNextEvent = async () => {
        fetch(`${host}/api/v0/events?next=event&api_token=${localStorage.getItem("api_token")}`)
            .then(res => {
                switch(res.status){
                    case 200:
                        return res.json()
                    default:
                        return []
                }
            })
            .then(data => {
                setNextEventIDs(data)
            })
    }

    const getNextPractice = async () => {
        fetch(`${host}/api/v0/events?next=practice&api_token=${localStorage.getItem("api_token")}`)
            .then(res => {
                switch(res.status){
                    case 200:
                        return res.json()
                    default:
                        return []
                }
            })
            .then(data => {
                setNextPracticeIDs(data)
            })
    }

    const getNextOther = async () => {
        fetch(`${host}/api/v0/events?next=other&api_token=${localStorage.getItem("api_token")}`)
            .then(res => {
                switch(res.status){
                    case 200:
                        return res.json()
                    default:
                        return []
                }
            })
            .then(data => {
                setNextOtherIDs(data)
            })
    }

    const getFixedEvents = async () => {
        fetch(`${host}/api/v0/events?fixed&api_token=${localStorage.getItem("api_token")}`)
            .then(res => {
                switch(res.status){
                    case 200:
                        return res.json()
                    default:
                        return []
                }
            })
            .then(data => {
                fixedEventIDsRef.current = data
            })
    }

    const showInstall = () => {
        let isiPhone = navigator.userAgent.toLowerCase().includes('iphone')
        if(!isiPhone && beforeInstallPrompt){
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
        getFixedEvents()
        getNextEvent()
        getNextPractice()
        getNextOther()
        let isiPhone = navigator.userAgent.toLowerCase().includes('iphone')
        setMobileBrowser((getDisplayMode() === 'browser tab' && window.innerWidth < parseInt(theme.medium.split('px')[0]) && (beforeInstallPrompt || isiPhone)))
    }, [theme.medium])

    useEffect(() => {
        let _fixedEventIDs = fixedEventIDsRef.current?.filter(eventID => {
            if (nextPracticeIDs && nextPracticeIDs.includes(eventID))
                return false
            if (nextEventIDs && nextEventIDs.includes(eventID))
                return false
            if (nextOtherIDs && nextOtherIDs.includes(eventID))
                return false
            return true
        })
        setFixedEventIDs(_fixedEventIDs)
    }, [nextPracticeIDs, nextEventIDs, nextOtherIDs])

    return(<StyledDashboard id="Dashboard">
        {mobileBrowser ? <StyledInfoText>
            <TbAlertTriangle onClick={showInstall}/>
        </StyledInfoText> : <></>}
        {mobileBrowser ? <StyledInfoText>Diese App kann auch installiert werden, einfach auf das Icon klicken!</StyledInfoText> : <></>}
        {showiosInstruction ? <StyledInfoText className='iosInstruction'>Erst <IoShareOutline />, dann <BsPlusSquare /></StyledInfoText> : <></>}
        {eventInfo ? <EventInfo hideEventInfo={hideEventInfo} eventInfoData={eventInfoData} fullname={fullname}/> : <DashboardAttendence fullname={fullname} nextPracticeIDs={nextPracticeIDs} nextEventIDs={nextEventIDs} nextOtherIDs={nextOtherIDs} fixedEventIDs={fixedEventIDs} showEventInfo={showEventInfo} auth_level={auth_level} theme={theme}/>}
        <Statistics theme={theme} auth_level={auth_level} />
        <Feedback />
        <Changelog read={localStorage.getItem("changelogRead") === version} version={version}/>
    </StyledDashboard>)
}

const DashboardAttendence = ({ fullname, nextPracticeIDs, nextEventIDs, nextOtherIDs, fixedEventIDs, showEventInfo, auth_level, theme}) => {
    return(
        <div>
            <BirthdayBlog fullname={fullname}/>
            {!nextPracticeIDs && !nextEventIDs && !nextOtherIDs ? <NextEvent nextEventID={undefined} theme={theme}/> : <></>}
            <Suspense>
                {fixedEventIDs?.length > 0 ? <div className='event_header'>Fixierte{fixedEventIDs.length === 1 ? "r" : ""} Termin{fixedEventIDs.length > 1 ? "e": ""}:</div> : <></>}
                {fixedEventIDs?.length > 0 ? fixedEventIDs.map(fixedEventID => {return(<NextEvent nextEventID={fixedEventID} key={`fixedEvent_${fixedEventID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme}/>)}) : <></>}
            </Suspense>
            <Suspense>
                {nextPracticeIDs?.length > 0 ? <div className='event_header'>Nächste Probe{nextPracticeIDs.length > 1 ? "n" : ""}:</div> : <></>}
                {nextPracticeIDs?.length > 0 ? nextPracticeIDs.map(nextPracticeID => {return(<NextEvent nextEventID={nextPracticeID} key={`nextPractice_${nextPracticeID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme} practice={true}/>)}) : <></>}
            </Suspense>
            <Suspense>
                {nextEventIDs?.length > 0 ? <div className='event_header'>Nächste{nextEventIDs.length === 1 ? "r" : ""} Auftritt{nextEventIDs.length > 1 ? "e" : ""}:</div> : <></>}
                {nextEventIDs?.length > 0 ? nextEventIDs.map(nextEventID => {return(<NextEvent nextEventID={nextEventID} key={`nextEvent_${nextEventID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme}/>)}) : <></>}
            </Suspense>
            <Suspense>
                {nextOtherIDs?.length > 0 ? <div className='event_header'>Nächste{nextOtherIDs.length === 1 ? "r" : ""} Termin{nextOtherIDs.length > 1 ? "e" : ""}:</div> : <></>}
                {nextOtherIDs?.length > 0 ? nextOtherIDs.map(nextOtherID => {return(<NextEvent nextEventID={nextOtherID} key={`nextOther_${nextOtherID}`} auth_level={auth_level} showEventInfo={showEventInfo} theme={theme}/>)}) : <></>}
            </Suspense>
        </div>
    )
}

const BirthdayBlog = ({ fullname }) => {
    const [members, setMembers] = useState(new Array(0))

    const getBDates = async () => {
        fetch(`${host}/api/v0/member?api_token=${localStorage.getItem('api_token')}`)
        .then(response => response.json())
        .then(members => {
            let dates = members.filter(member => {
                let date = new Date(member.Birthdate)
                let now = new Date()
                date.setFullYear(now.getFullYear())
                let diff = date.getTime() - now.getTime()
                return (-604800000 < diff && diff < 604800000)
            }).sort((bday_a, bday_b) => {
                let date_a = new Date(bday_a.Birthdate)
                let date_b = new Date(bday_b.Birthdate)

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
            setMembers(dates)
    })
    }

    useEffect(() => {
        getBDates()
    }, [])
    if(members?.length > 0){
        return(<div>
            <h3>Geburtstage:</h3>
            {members?.map(member => {
                let birthday = new Date(member.Birthdate)
                let today = new Date()
                let same = today.getDate() === birthday.getDate()
                let member_fullname = member.Forename + " " + member.Surname
                if(fullname === member_fullname && same)
                    return(<div key={member_fullname}>Herzlichen Glückwunsch, {fullname.split(" ")[0]}!</div>)
                else
                    return(<div key={member_fullname}>{member_fullname}: {birthday.getDate()}.{birthday.getMonth() + 1}, {today.getFullYear() - birthday.getFullYear()} Jahre</div>)
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