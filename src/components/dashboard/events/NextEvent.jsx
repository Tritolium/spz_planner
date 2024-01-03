import { Suspense, useCallback, useEffect, useState } from "react"
import { getEvalByEvent, getWeather, updateAttendences } from "../../../modules/data/DBConnect"
import Terminzusage from "../../dateplanner/attendenceInput/Terminzusage"
import { FaUserGroup } from "react-icons/fa6"
import { ClothingData, DashboardDiagram, PlusOneData } from "./Event"
import WeatherIcon from "../WeatherIcon"

const NextEvent = ({ nextEvent, auth_level, showEventInfo, theme }) => {

    const [weather, setWeather] = useState()
    const [evaluation, setEvaluation] = useState()
    const [attendence, setAttendence] = useState(nextEvent?.Attendence)
    const [plusone, setPlusOne] = useState(nextEvent?.PlusOne)
    let eventDate = new Date(nextEvent?.Date)

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
            {nextEvent?.Ev_PlusOne ? <PlusOneData attendence={attendence} theme={theme} callback={updatePlusOne} plusOne={plusone}/> : <></>}
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
        {nextEvent?.Ev_PlusOne && evaluation?.PlusOne > 0 ? <tr>
            <td><FaUserGroup className='Plusone_icon'/></td>
            <td>+{evaluation?.PlusOne}</td>
        </tr> : <></>}
        
    </>)
}

export default NextEvent