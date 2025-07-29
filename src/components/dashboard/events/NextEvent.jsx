import { useCallback, useEffect, useState } from "react"
import { getWeather, host, updateAttendence } from "../../../modules/data/DBConnect"
import { FaUserGroup } from "react-icons/fa6"
import WeatherIcon from "../WeatherIcon"
import { StyledEvent } from "./Event.styled"
import { Clothing } from "../../../modules/components/icons/Clothing"
import PlusOne from "../../../modules/components/icons/PlusOne"
import OwnArrival from "../../../modules/components/icons/OwnArrival"
import Event from "./Event"
import { EventFallback } from "./EventFallback"
import { EVENT_STATE } from "../../dateadministration/eventform/EventForm"

const NextEvent = ({ nextEventID, auth_level, showEventInfo, practice=false, theme }) => {

    let className = ""

    const [nextEvent, setNextEvent] = useState()
    const [weather, setWeather] = useState()
    const [evaluation, setEvaluation] = useState()
    const [attendence, setAttendence] = useState()
    const [plusone, setPlusOne] = useState()
    const [ownArrival, setOwnArrival] = useState()

    const updateWeather = useCallback(async () => {
        let eDate = new Date(nextEvent?.Date)
        let nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 6)
        if(nextEvent !== undefined && eDate < nextWeek) {
            getWeather(nextEvent).then(weather => {
                setWeather(weather)
            })
        }
    }, [nextEvent])

    const onClick = async (event_id, att) => {
        await updateAttendence(event_id, att, plusone, ownArrival)
        setAttendence(att)
        updateEventEval()
    }

    const updatePlusOne = async () => {
        await updateAttendence(nextEvent?.Event_ID, attendence, !plusone, ownArrival)
        setPlusOne(!plusone)
        updateEventEval()
    }

    const updateOwnArrival = async () => {
        await updateAttendence(nextEvent?.Event_ID, attendence, plusone, !ownArrival)
        setOwnArrival(!ownArrival)
        updateEventEval()
    }

    const updateEventEval = useCallback(async () => {
        fetch(`${host}/api/v0/attendence/${nextEventID}?api_token=${localStorage.getItem('api_token')}`)
        .then(res => res.json())
        .then(res => {
            setAttendence(res.Event.Attendence)
            setPlusOne(res.Event.PlusOne)
            setOwnArrival(res.Event.OwnArrival)
            setEvaluation(res.Attendence)
        })
    }, [nextEventID])

    useEffect(() => {
        fetch(`${host}/api/v0/attendence/${nextEventID}?api_token=${localStorage.getItem('api_token')}`)
        .then(res => res.json())
        .then(res => {
            setNextEvent(res.Event)
            setAttendence(res.Event.Attendence)
            setPlusOne(res.Event.PlusOne)
            setOwnArrival(res.Event.OwnArrival)
            setEvaluation(res.Attendence)
        })
    }, [nextEventID])

    useEffect(() => {
        if(nextEvent !== undefined){
            updateEventEval()
            updateWeather()
        }
    }, [nextEvent, updateEventEval, updateWeather])

    useEffect(() => {
        const interval = setInterval(() => {
            updateEventEval()
            updateWeather()
        }, 60000);
        return () => clearInterval(interval);
      }, [updateEventEval, updateWeather]);

    switch(nextEvent?.State){
        case EVENT_STATE.CANCELED:
            className = "CanceledEvent"
            break
        case EVENT_STATE.PENDING:
            className = "PendingEvent"
            break
        default:
            className = ""
            break
    }

    return(<>
        {nextEvent !== undefined ? <StyledEvent className={className}>
            <Event event={nextEvent} evaluation={evaluation} auth_level={auth_level} onClick={onClick} showEventInfo={showEventInfo} theme={theme} practice={practice}/>
            {!practice || nextEvent.Type.includes("Open Air") ? (
                <Additional
                    event={nextEvent}
                    plusone={plusone}
                    ownArrival={ownArrival}
                    attendence={attendence}
                    updatePlusOne={updatePlusOne}
                    updateOwnArrival={updateOwnArrival}
                    weather={weather}
                    evaluation={evaluation}
                    theme={theme}
                />
            ) : <></>}
        </StyledEvent> : <EventFallback theme={theme}/>}
    </>)
}

const Additional = ({ event, plusone, ownArrival, attendence, updatePlusOne, updateOwnArrival, weather, evaluation, theme }) => {
    return(<>
        <div className="departure">Abfahrt:</div>
        <div className="event_departure">{event?.Departure !== "12:34:56" && event?.Departure !== null ? `${event?.Departure.slice(0, 5)} Uhr` : "-"}</div>
        <div className="leave_dep">Rückfahrt:</div>
        <div className="event_leave_dep">{event?.Leave_dep !== "12:34:56" && event?.Leave_dep !== null ? `${event?.Leave_dep.slice(0, 5)} Uhr` : "-"}</div>
        {parseInt(event?.Clothing) !== 0 ? <div className="clothing">Bekleidung:</div> : <></>}
        {parseInt(event?.Clothing) !== 0 ? <div className="event_clothing"><Clothing clothing={parseInt(event?.Clothing)} /></div> : <></>}
        {event?.Ev_PlusOne ? <PlusOne className="plusone_input" plusOne={plusone} active={attendence === 1} onClick={updatePlusOne} theme={theme}/> : <></>}
        <OwnArrival className="ownarrival_input" ownArrival={ownArrival} active={attendence === 1} onClick={updateOwnArrival} theme={theme}/>
        {weather ? <div className="weather">Wetter:</div> : <></>}
        {weather ? <div className="weather_temp" >{`${weather.Temperature}°C`}</div> : <></>}
        {weather ? <div className="weather_icon"><WeatherIcon code={weather.Weathercode} /></div> : <></>}
        {event?.Ev_PlusOne && evaluation?.PlusOne > 0 ? <div className="plusone_icon"><FaUserGroup className='Plusone_icon'/></div> : <></>}
        {event?.Ev_PlusOne && evaluation?.PlusOne > 0 ? <div className="plusone">+{evaluation?.PlusOne}</div> : <></>}
    </>)
}

export default NextEvent