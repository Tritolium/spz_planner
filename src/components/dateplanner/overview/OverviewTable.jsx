import { Fragment, useState } from "react"
import DateField from "../attendenceInput/DateField"
import { StyledOverviewTable } from "./Overview.styled"
import { Zusage } from "./Overview"

const ATTENDENCE_STATES = [-1, 0, 1, 2, 3]

const getNextAttendence = (current) => {
    const parsed = parseInt(current, 10)
    const normalized = Number.isNaN(parsed) ? -1 : parsed
    const index = ATTENDENCE_STATES.indexOf(normalized)
    if (index === -1)
        return ATTENDENCE_STATES[0]
    return ATTENDENCE_STATES[(index + 1) % ATTENDENCE_STATES.length]
}

export const OverviewTable = ({attendences, theme, editing, pendingChanges, onChange}) => {
    return(<StyledOverviewTable>
            <span className="Date Header">Termin:</span>
            {attendences[0].Attendences.map((att) => {
                return(<NameTag key={att.Fullname} Fullname={att.Fullname}/>)
            })}
            {attendences.map(event => {
                return(<Fragment key={`row_${event.Event_ID}`}>
                    <span key={event.Event_ID} className="DateTag"><DateField dateprops={event}/></span>
                    {event.Attendences.map((attendence, index) => {
                        const className = index === event.Attendences.length - 1 ? "AttendenceTag Last" : "AttendenceTag"
                        const parsedAttendence = parseInt(attendence.Attendence, 10)
                        const originalAttendence = Number.isNaN(parsedAttendence) ? -1 : parsedAttendence
                        const pending = pendingChanges?.[String(event.Event_ID)]?.[String(attendence.Member_ID)]
                        const currentAttendence = pending === undefined ? originalAttendence : pending
                        const isChanged = pending !== undefined
                        const editableClass = editing ? " Editable" : ""
                        const changedClass = isChanged ? " Changed" : ""
                        const combinedClass = `${className}${editableClass}${changedClass}`
                        const handleClick = editing && onChange ? () => {
                            const nextAttendence = getNextAttendence(currentAttendence)
                            onChange(event.Event_ID, attendence.Member_ID, nextAttendence, originalAttendence)
                        } : undefined

                        return(
                            <span key={attendence.Fullname + event.Event_ID} className={combinedClass}>
                                <Zusage
                                    attendence={currentAttendence}
                                    plusone={attendence.PlusOne}
                                    prediction={attendence.Prediction}
                                    theme={theme}
                                    credible={attendence.Credible}
                                    onClick={handleClick}
                                />
                            </span>
                        )
                    })}
                </Fragment>)
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
        <span className={showTooltip ? "NameTagActive Header" : "NameTag Header"} onClick={toggleTooltip}>{showTooltip ? Fullname : initials}</span>
    )
}
