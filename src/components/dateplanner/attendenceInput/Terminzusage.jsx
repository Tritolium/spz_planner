import { useCallback, useEffect, useState } from 'react'
import { IoIosAlert, IoIosCloseCircle, IoIosRemoveCircle } from 'react-icons/io'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { StyledTerminzusage } from './Terminzusage.styled'
import { IconContext } from 'react-icons'
import { FaUserGroup } from 'react-icons/fa6'
import { ImSpinner10 } from 'react-icons/im'

const Terminzusage = (props) => {

    const [attendence, setAttendences] = useState(props.attendence)
    const [loading, setLoading] = useState(false)

    const onClick = useCallback(async () => {
        let now = new Date()
        let event_date = props.event !== undefined ? new Date(props.event?.Date) : undefined
        if(event_date && props.event.Begin){
            event_date.setHours(props.event.Begin.split(':')[0])
            event_date.setMinutes(props.event.Begin.split(':')[1])
            if(now.getTime() > event_date.getTime()){
                alert("Du kannst deine Zusage nicht mehr ändern, da der Termin bereits begonnen hat. Solltest du vergessen haben abzusagen, schick bitte eine WhatsApp.")
                return
            } else if (props.event?.Category === "event" && now.getTime() > event_date.getTime() - 5400000){
                alert("Du kannst deine Zusage nicht mehr ändern, da der Termin in weniger als 1,5 Stunden beginnt. Schick bitte eine WhatsApp zum An- oder Abmelden.")
                return
            }
        }
        let new_att = (attendence + 1) % props.states
        setLoading(true)
        await props.onClick(props.event_id, new_att)
        setLoading(false)
        setAttendences(new_att)
    }, [props, attendence])

    useEffect(() => {
        setAttendences(props.attendence)
    }, [props.attendence])

    return(
        <StyledTerminzusage className="Terminzusage">
            {props.cancelled ? <Button attendence={0} theme={props.theme}/> : <Button callback={onClick} attendence={attendence} theme={props.theme}/>}
            {loading ? <ImSpinner10 className='LoadingSpinner'/> : null}
        </StyledTerminzusage>
    )
}

const Button = (props) => {
    switch(props.attendence){
    default:
    case -1:
        return(<Blank callback={props.callback} theme={props.theme}/>)
    case 0:
        return(<Deny callback={props.callback} theme={props.theme}/>)
    case 1:
        return(<Check callback={props.callback} theme={props.theme}/>)
    case 2:
        return(<Alert callback={props.callback} theme={props.theme}/>)
    }
}

export const Blank = ({ callback, size, theme, overlay, className }) => {
    //#24b9d0
    let fill = [theme.green, theme.red, theme.darkred]
    return(
        <div className={`ButtonWrapper ${className}`}>
            <IconContext.Provider value={{color: theme.blue, className: "IconWrapper Attendence_none"}}>
                <IoIosAlert size="100%" onClick={callback}/>
                <Circle callback={callback} fill={fill[overlay]} />
            </IconContext.Provider>
        </div>
    )
}

export const Check = ({ callback, theme, className }) => {
    //#00bd00
    return(
        <div className={`ButtonWrapper ${className}`}>
            <IconContext.Provider value={{color: theme.green, className: "IconWrapper "}}>
                <IoCheckmarkCircle size="100%" onClick={callback}/>
                <Circle callback={callback} />
            </IconContext.Provider>
        </div>
    )
}

export const Deny = ({ callback, theme, className }) => {
    //#fe423e
    return(
        <div className={`ButtonWrapper ${className}`}>
            <IconContext.Provider value={{color: theme.red, className: "IconWrapper"}}>
                <IoIosCloseCircle size="100%" onClick={callback}/>
                <Circle callback={callback} />
            </IconContext.Provider>
        </div>
    )
}

export const Alert = ({ callback, theme, className }) => {
    //#ffa11c
    return(
        <div className={`ButtonWrapper ${className}`}>
            <IconContext.Provider value={{color: theme.yellow, className: "IconWrapper"}}>
                <IoIosAlert size="100%" onClick={callback}/>
                <Circle callback={callback} />
            </IconContext.Provider>
        </div>
    )
}

export const Unregistered = ({ callback }) => {
    //#904c77
    return(
        <div className="ButtonWrapper">
            <IconContext.Provider value={{color: "#904c77", className: "IconWrapper"}}>
                <IoIosRemoveCircle size="100%" onClick={callback}/>
                <Circle callback={callback} />
            </IconContext.Provider>
        </div>
    )
}

export const Noshow = ({ callback }) => {
    //#7d7abc
    return(
        <IconContext.Provider value={{color: "#7d7abc", className: "IconWrapper"}}>
            <IoIosAlert size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const DeniedCheck = ({ callback }) => {
    return(
        <IconContext.Provider value={{color: "#00bd00", className: "IconWrapper"}}>
            <IoIosCloseCircle size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const PlusOne = ({ callback, theme, className="" }) => {
    return(
        <IconContext.Provider value={{color: "white", className: `IconWrapper ${className}`}}>
            <FaUserGroup size="50%" onClick={callback}/>
            <Circle callback={callback} fill={theme.greenRGB} r='40.625%'/>
        </IconContext.Provider>
    )
}

const Circle = ({ callback, fill='white', r="35%" }) => {
    return(<svg size="100%" className='IconWrapper'><circle cx="50%" cy="50%" r={r} fill={fill} onClick={callback}/></svg>)
}

export default Terminzusage