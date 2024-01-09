import { useState } from "react"
import DateField from "../attendenceInput/DateField"
import { StyledOverviewTable } from "./Overview.styled"
import { Zusage } from "./Overview"

export const OverviewTable = ({attendences, theme}) => {
    return(
        <StyledOverviewTable>
            <thead>
                <tr>
                    <th>Termin:</th>
                    {attendences[0].Attendences.map((att) => {
                        return(<Header key={att.Fullname} Fullname={att.Fullname} />)
                    })}
                </tr>
            </thead>
            <tbody>
                {
                    attendences.map(event => {
                        return(
                            <tr key={event.Event_ID}>
                                <td><DateField dateprops={event}/></td>
                                {event.Attendences.map(attendence => {
                                    return(<td key={attendence.Fullname + event.Event_ID}><Zusage attendence={attendence.Attendence} plusone={attendence.PlusOne} theme={theme}/></td>)
                                })}
                            </tr>
                        )
                    })
                }
            </tbody>
            </StyledOverviewTable>
    )
}

const Header = ({ Fullname }) => {

    const [showTooltip, setShowTooltip] = useState(false)

    const initials = Fullname.split(' ')[0].slice(0, 2) + Fullname.split(' ')[1][0]

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip)
    }

    return(
        <th className={showTooltip ? "Tooltip" : "Header"} onClick={toggleTooltip}>{showTooltip ? Fullname : initials}</th>
    )
}