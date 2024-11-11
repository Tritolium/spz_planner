import { AttendenceInput } from "../../dateplanner/attendenceInput/AttendenceInput"
import DashboardDiagram from "./DashboardDiagram"

const Event = ({ event, evaluation, auth_level, onClick, showEventInfo, practice, theme }) => {
    let eventDate = new Date(event?.Date)
    let attendence = event?.Attendence

    const clickEvent = () => {
        showEventInfo(event)
    }

    return(<>
        <div className="event_type" onClick={clickEvent}>{event?.Type}</div>
        <div className="event_location" onClick={clickEvent}>{event?.Location}</div>
        <AttendenceInput event={event} attendence={attendence} onClick={onClick} theme={theme}/>
        <div className="event_date" onClick={clickEvent}>{eventDate.getDate()}.{eventDate.getMonth() + 1}.{eventDate.getFullYear()}</div>
        <div className="event_begin" onClick={clickEvent}>{event?.Begin !== "12:34:56" && event?.Begin !== null ? `${event?.Begin.slice(0, 5)} Uhr` : "-"}</div>
        {auth_level > 0 ? <div className="event_diagram"><DashboardDiagram className={"event_diagram"} event={evaluation} association_id={event.Association_ID} auth_level={auth_level} practice={practice} theme={theme}/></div> : <></>}
    </>)
}

export default Event