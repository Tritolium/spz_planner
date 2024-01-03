import { Suspense, useCallback, useEffect, useState } from "react"
import { getEvalByEvent, getWeather, updateAttendences } from "../../../modules/data/DBConnect"
import Terminzusage from "../../dateplanner/attendenceInput/Terminzusage"
import { ClothingData, DashboardDiagram, PlusOneData } from "./Event"
import WeatherIcon from "../WeatherIcon"
import { FaUserGroup } from "react-icons/fa6"

const NextOther = ({ nextOther, auth_level, showEventInfo, theme }) => {

    const [weather, setWeather] = useState()
    const [evaluation, setEvaluation] = useState()
    const [attendence, setAttendence] = useState(nextOther?.Attendence)
    const [plusone, setPlusOne] = useState(nextOther?.PlusOne)

    let gigDate = new Date(nextOther?.Date)

    const onClick = async (event_id, att) => {
        let changes = {}
        changes['' + event_id] = [att, plusone]
        setAttendence(att)
        await updateAttendences(changes, false)
        updateEventEval()
    }

    const updatePlusOne = async () => {
        let changes = {}
        changes['' + nextOther?.Event_ID] = [attendence, !plusone]
        await updateAttendences(changes, false)
        setPlusOne(!plusone)
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
        </tr>LANUV
        <tr>
            <td onClick={clickTD}>Zurück:</td>
            <td onClick={clickTD}>{nextOther?.Leave_dep !== "12:34:56" && nextOther?.Leave_dep !== null ? `${nextOther?.Leave_dep.slice(0, 5)} Uhr` : "-"}</td>
        </tr>
        <tr>
            <ClothingData  onClick={clickTD} clothing={nextOther?.Clothing} />
            {nextOther?.Ev_PlusOne ? <PlusOneData attendence={attendence} theme={theme} callback={updatePlusOne} plusOne={plusone} /> : <></>}            
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
        {nextOther?.Ev_PlusOne && evaluation?.PlusOne > 0 ? <tr>
            <td><FaUserGroup className='Plusone_icon'/></td>
            <td>+{evaluation?.PlusOne}</td>
        </tr> : <></>}
    </>)
}

export default NextOther