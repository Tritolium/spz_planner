import { ImSpinner10 } from "react-icons/im"
import { StyledEvent } from "./Event.styled"

export const EventFallback = ({ theme }) => {
    return (<StyledEvent>
        <span className="event_type fallback"></span>
        <span className="event_location fallback"></span>
        <span className="event_attendence fallback"></span>
        <span className="event_date fallback"></span>
        <span className="event_begin fallback"></span>
        <span className="event_diagram fallback"></span>
        <ImSpinner10 className="fallback_icon"/>
    </StyledEvent>)
}