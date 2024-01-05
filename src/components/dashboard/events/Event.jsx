import Terminzusage from "../../dateplanner/attendenceInput/Terminzusage"
import DashboardDiagram from "./DashboardDiagram"

const Event = ({ event, attendence, evaluation, auth_level, onClick, clickTD, theme }) => {
    let eventDate = new Date(event?.Date)

    return(<>
        <div className="event_type" onClick={clickTD}>{event.Type}</div>
        <div className="event_location" onClick={clickTD}>{event.Location}</div>
        <Terminzusage className="event_attendence" event={event} event_id={event?.Event_ID} states={3} attendence={attendence} onClick={onClick} cancelled={event?.Type.includes('Abgesagt')} theme={theme}/>
        <div className="event_date" onClick={clickTD}>{eventDate.getDate()}.{eventDate.getMonth() + 1}.{eventDate.getFullYear()}</div>
        <div className="event_begin" onClick={clickTD}>{event?.Begin !== "12:34:56" && event?.Begin !== null ? `${event?.Begin.slice(0, 5)} Uhr` : "-"}</div>
        {auth_level > 1 ? <div className="event_diagram"><DashboardDiagram className={"event_diagram"} event={evaluation} auth_level={auth_level} theme={theme}/></div> : <></>}
    </>)
}

export default Event