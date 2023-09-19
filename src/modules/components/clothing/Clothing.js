import blank from '../../../icons/blank_old.png'
import polo from '../../../icons/polo.png'
import polod from '../../../icons/polod.png'
import shirt from '../../../icons//shirt.png'
import suit from '../../../icons//suit.png'
import cow from '../../../icons/cow.png'
import pants from '../../../icons/pants.png'

export const clothingStyles = 7

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
    case 6:
        icon = pants
        break
    default:
        break
    }

    return(
        icon ? <img src={icon} alt="Uniform"/> : <></>
    )
}

export const ClothingInput = ({ clothing, onClick }) => {

    let icon

    switch(parseInt(clothing)){
    case 0:
        icon = blank
        break
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
    case 6:
        icon = pants
        break
    default:
        break
    }

    return(
        icon ? <img src={icon} alt="Uniform" onClick={onClick}/> : <></>
    )
}