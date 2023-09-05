import { useCallback, useState } from 'react'
import { IoIosAlert, IoIosCloseCircle } from 'react-icons/io'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { StyledTerminzusage } from './Terminzusage.styled'
import { IconContext } from 'react-icons'
import { theme } from '../../../theme'

const Terminzusage = (props) => {

    const [attendence, setAttendences] = useState(props.attendence)

    const onClick = useCallback(() => {
        let new_att = (attendence + 1) % props.states
        setAttendences(new_att)
        props.onClick(props.event_id, new_att)
    }, [props, attendence])

    return(
        <StyledTerminzusage className="Terminzusage">
            {props.cancelled ? <Button attendence={0}/> : <Button callback={onClick} attendence={attendence}/>}
        </StyledTerminzusage>
    )
}

const Button = (props) => {
    switch(props.attendence){
    default:
    case -1:
        return(<Blank callback={props.callback}/>)
    case 0:
        return(<Deny callback={props.callback}/>)
    case 1:
        return(<Check callback={props.callback}/>)
    case 2:
        return(<Alert callback={props.callback} />)
    }
}

export const Blank = ({ callback, size }) => {
    //#24b9d0
    return(
        <IconContext.Provider value={{color: theme.blue, className: "IconWrapper"}}>
            <IoIosAlert size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Check = ({ callback }) => {
    //#00bd00
    return(
        <IconContext.Provider value={{color: theme.green, className: "IconWrapper"}}>
            <IoCheckmarkCircle size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Deny = ({ callback }) => {
    //#fe423e
    return(
        <IconContext.Provider value={{color: theme.red, className: "IconWrapper"}}>
            <IoIosCloseCircle size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Alert = ({ callback }) => {
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