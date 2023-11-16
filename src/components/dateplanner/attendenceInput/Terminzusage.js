import { useCallback, useState } from 'react'
import { IoIosAlert, IoIosCloseCircle } from 'react-icons/io'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { StyledTerminzusage } from './Terminzusage.styled'
import { IconContext } from 'react-icons'

const Terminzusage = (props) => {

    const [attendence, setAttendences] = useState(props.attendence)

    const onClick = useCallback(() => {
        let now = new Date()
        let event_date = props.event !== undefined ? new Date(props.event?.Date) : undefined
        if(event_date){
            event_date.setHours(props.event.Begin.split(':')[0])
            event_date.setMinutes(props.event.Begin.split(':')[1])
            if(now.getTime() > event_date.getTime()){
                return
            }
        }
        let new_att = (attendence + 1) % props.states
        setAttendences(new_att)
        props.onClick(props.event_id, new_att)
    }, [props, attendence])

    return(
        <StyledTerminzusage className="Terminzusage">
            {props.cancelled ? <Button attendence={0} theme={props.theme}/> : <Button callback={onClick} attendence={attendence} theme={props.theme}/>}
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

export const Blank = ({ callback, size, theme }) => {
    //#24b9d0
    return(
        <IconContext.Provider value={{color: theme.blue, className: "IconWrapper"}}>
            <IoIosAlert size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Check = ({ callback, theme }) => {
    //#00bd00
    return(
        <IconContext.Provider value={{color: theme.green, className: "IconWrapper"}}>
            <IoCheckmarkCircle size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Deny = ({ callback, theme }) => {
    //#fe423e
    return(
        <IconContext.Provider value={{color: theme.red, className: "IconWrapper"}}>
            <IoIosCloseCircle size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Alert = ({ callback, theme }) => {
    //#ffa11c
    return(
        <IconContext.Provider value={{color: theme.yellow, className: "IconWrapper"}}>
            <IoIosAlert size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

const Circle = ({ callback }) => {
    return(<svg size="100%" className='IconWrapper'><circle cx="50%" cy="50%" r="35%" fill='white' onClick={callback}/></svg>)
}

export default Terminzusage