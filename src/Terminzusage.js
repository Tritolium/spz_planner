import { useCallback } from "react"

import check from './check.png'
import alert from './alert.png'
import deny from './delete-button.png'

const Terminzusage = (props) => {
    const onClick = useCallback(() => {
        props.onClick()
    }, [props])

    return(
        <Button callback={onClick} attendence={props.attendence}/>
    )
}

const Button = (props) => {
    switch(props.attendence){
    default:
    case 0:
        return(<img src={deny} alt="Absage" onClick={props.callback} />)
    case 1:
        return(<img src={alert} alt="Unsicher" onClick={props.callback} />)
    case 2:
        return(<img src={check} alt="Zusage" onClick={props.callback} />)
    }
}

export default Terminzusage