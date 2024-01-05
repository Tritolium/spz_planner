import { useCallback, useEffect, useState } from "react"
import { getEvalByEvent, getWeather, updateAttendences } from "../../../modules/data/DBConnect"
import { FaUserGroup } from "react-icons/fa6"
import WeatherIcon from "../WeatherIcon"
import { StyledEvent } from "./Event.styled"
import { Clothing } from "../../../modules/components/icons/Clothing"
import PlusOne from "../../../modules/components/icons/PlusOne"
import Event from "./Event"

const NextEvent = ({ nextEvent, auth_level, showEventInfo, theme }) => {

    const [weather, setWeather] = useState()
    const [evaluation, setEvaluation] = useState()
    const [attendence, setAttendence] = useState(nextEvent?.Attendence)
    const [plusone, setPlusOne] = useState(nextEvent?.PlusOne)

    const onClick = async (event_id, att) => {
        let changes = {}
        changes['' + event_id] = [att, plusone]
        await updateAttendences(changes, false)
        setAttendence(att)
        updateEventEval()
    }

    const updatePlusOne = async () => {
        let changes = {}
        changes['' + nextEvent?.Event_ID] = [attendence, !plusone]
        await updateAttendences(changes, false)
        setPlusOne(!plusone)
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
        <StyledEvent>
            <Event event={nextEvent} attendence={attendence} evaluation={evaluation} auth_level={auth_level} onClick={onClick} clickTD={clickTD} theme={theme}/>
            <div className="departure">Abfahrt:</div>
            <div className="event_departure" onClick={clickTD}>{nextEvent?.Departure !== "12:34:56" && nextEvent?.Departure !== null ? `${nextEvent?.Departure.slice(0, 5)} Uhr` : "-"}</div>
            <div className="leave_dep">Rückfahrt:</div>
            <div className="event_leave_dep" onClick={clickTD}>{nextEvent?.Leave_dep !== "12:34:56" && nextEvent?.Leave_dep !== null ? `${nextEvent?.Leave_dep.slice(0, 5)} Uhr` : "-"}</div>
            {parseInt(nextEvent?.Clothing) !== 0 ? <div className="clothing">Bekleidung:</div> : <></>}
            {parseInt(nextEvent?.Clothing) !== 0 ? <div className="event_clothing" onClick={clickTD}><Clothing clothing={parseInt(nextEvent?.Clothing)} /></div> : <></>}
            {nextEvent?.Ev_PlusOne ? <PlusOne className="plusone_input" plusOne={plusone} active={attendence === 1} onClick={updatePlusOne} theme={theme}/> : <></>}
            {weather ? <div className="weather">Wetter:</div> : <></>}
            {weather ? <div className="weather_temp" >{`${weather.Temperature}°C`}</div> : <></>}
            {weather ? <div className="weather_icon"><WeatherIcon code={weather.Weathercode} /></div> : <></>}
            {nextEvent?.Ev_PlusOne && evaluation?.PlusOne > 0 ? <div className="plusone_icon"><FaUserGroup className='Plusone_icon'/></div> : <></>}
            {nextEvent?.Ev_PlusOne && evaluation?.PlusOne > 0 ? <div className="plusone">+{evaluation?.PlusOne}</div> : <></>}
        </StyledEvent>        
    </>)
}

export default NextEvent