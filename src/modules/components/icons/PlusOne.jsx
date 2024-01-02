import { IconContext } from "react-icons"
import { FaUser, FaUserGroup } from "react-icons/fa6"
import { StyledPlusOne } from "./PlusOne.styled"

const PlusOne = ({ active, plusOne, onClick, theme }) => {

    return(
        <StyledPlusOne >
            <IconContext.Provider value={{ color: "white", className: "IconWrapper UserIcon"}}>
                {plusOne ? <FaUserGroup onClick={onClick} size={"50%"}/> : <FaUser size={"50%"} onClick={onClick} />}
                <Circle callback={onClick} active={active} theme={theme}/>
            </IconContext.Provider>
        </StyledPlusOne>
    )
}

const Circle = ({ callback, active, theme }) => {
    return(<svg className='IconWrapper'><circle cx="50%" cy="50%" r="40.625%" fill={active ? theme.greenRGB : theme.blue} onClick={callback}/></svg>)
}

export default PlusOne