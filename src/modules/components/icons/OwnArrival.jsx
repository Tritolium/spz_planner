import { IconContext } from "react-icons"
import { FaBus, FaCar } from "react-icons/fa6"
import { StyledOwnArrival } from "./OwnArrival.styled"

const OwnArrival = ({ active, ownArrival, onClick, theme, className }) => {
    return(
        <StyledOwnArrival className={className}>
            <IconContext.Provider value={{ color: "white", className: "IconWrapper UserIcon" }}>
                {ownArrival && active ? <FaCar onClick={onClick} size={"50%"}/> : <FaBus onClick={onClick} size={"50%"}/>}
                <Circle callback={onClick} active={active} theme={theme}/>
            </IconContext.Provider>
        </StyledOwnArrival>
    )
}

const Circle = ({ callback, active, theme }) => (
    <svg className='IconWrapper'><circle cx="50%" cy="50%" r="40.625%" fill={active ? theme.greenRGB : theme.blue} onClick={callback}/></svg>
)

export default OwnArrival
