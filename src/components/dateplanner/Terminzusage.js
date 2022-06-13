import check from './check.png'
import alert from './alert.png'
import deny from './delete-button.png'
import blank from './blank.png'
import { useCallback, useState } from 'react'

const Terminzusage = (props) => {

    const [attendence, setAttendences] = useState(props.attendence)

    const onClick = useCallback(() => {
        let new_att = (attendence + 1) % 3
        setAttendences(new_att)
        props.onClick(props.event_id, new_att)
    }, [props, attendence])

    return(
        <Button callback={onClick} attendence={attendence}/>
    )
}

const Button = (props) => {
    switch(props.attendence){
    default:
    case -1:
        return(<img src={blank} alt="Ohne Rückmeldung" onClick={props.callback} />)
    case 0:
        return(<img src={deny} alt="Absage" onClick={props.callback} />)
    case 1:
        return(<img src={alert} alt="Unsicher" onClick={props.callback} />)
    case 2:
        return(<img src={check} alt="Zusage" onClick={props.callback} />)
    }
}

export default Terminzusage