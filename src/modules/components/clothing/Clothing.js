import polo from '../../../icons/polo.png'
import polod from '../../../icons/polod.png'
import shirt from '../../../icons//shirt.png'
import suit from '../../../icons//suit.png'
import cow from '../../../icons/cow.png'

export const Clothing = ({ clothing }) => {

    let icon

    switch(parseInt(clothing)){
    case 1:
        icon = polo
        break
    case 2:
        icon = polod
        break
    case 3:
        icon = shirt
        break
    case 4:
        icon = suit
        break
    case 5:
        icon = cow
        break
    default:
        break
    }

    return(
        icon ? <img src={icon} alt="Uniform" loading="lazy" /> : <></>
    )
}