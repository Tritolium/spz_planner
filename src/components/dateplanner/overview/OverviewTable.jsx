import { useState } from "react"
import DateField from "../attendenceInput/DateField"
import { StyledOverviewTable } from "./Overview.styled"
import { Zusage } from "./Overview"

export const OverviewTable = ({attendences, theme}) => {
    return(<StyledOverviewTable>
            <span className="Date">Termin:</span>
            {attendences[0].Attendences.map((att) => {
                return(<NameTag key={att.Fullname} Fullname={att.Fullname}/>)
            })}
            {attendences.map(event => {
                return(<>
                    <span key={event.Event_ID} className="DateTag"><DateField dateprops={event}/></span>
                    {event.Attendences.map((attendence, index) => {
                        const className = index === event.Attendences.length - 1 ? "AttendenceTag Last" : "AttendenceTag"
                        return(<span key={attendence.Fullname + event.Event_ID} className={className}><Zusage attendence={attendence.Attendence} plusone={attendence.PlusOne} theme={theme}/></span>)
                    })}
                </>)
            })}
        </StyledOverviewTable>)
}

const NameTag = ({ Fullname }) => {    
    const [showTooltip, setShowTooltip] = useState(false)

    const initials = Fullname.split(' ')[0].slice(0, 2) + Fullname.split(' ')[1][0]

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip)
    }

    return(
        <span className={showTooltip ? "NameTagActive" : "NameTag"} onClick={toggleTooltip}>{showTooltip ? Fullname : initials}</span>
    )
}