import { IconContext } from "react-icons"
import { IoIosAlert, IoIosCloseCircle } from 'react-icons/io'
import { IoCheckmarkCircle } from 'react-icons/io5'

export const Blank = ({ callback, size }) => {
    //#24b9d0
    return(
        <IconContext.Provider value={{color: "#24b9d0", className: "IconWrapper"}}>
            <IoIosAlert size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Check = ({ callback }) => {
    //#00bd00
    return(
        <IconContext.Provider value={{color: "#00bd00", className: "IconWrapper"}}>
            <IoCheckmarkCircle size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Deny = ({ callback }) => {
    //#fe423e
    return(
        <IconContext.Provider value={{color: "#fe423e", className: "IconWrapper"}}>
            <IoIosCloseCircle size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

export const Alert = ({ callback }) => {
    //#ffa11c
    return(
        <IconContext.Provider value={{color: "#ffa11c", className: "IconWrapper"}}>
            <IoIosAlert size="100%" onClick={callback}/>
            <Circle callback={callback} />
        </IconContext.Provider>
    )
}

const Circle = ({ callback }) => {
    return(<svg size="100%" className='IconWrapper'><circle cx="50%" cy="50%" r="35%" fill='white' onClick={callback}/></svg>)
}