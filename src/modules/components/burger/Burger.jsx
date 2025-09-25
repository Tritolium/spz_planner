import React from 'react'
import { StyledBurger } from "./Burger.styled"
const Burger = ({ open, setOpen }) => {

    const onClick = () => {
        setOpen(!open)
    }

    return(
        <StyledBurger id='main_menu' title='Hauptmenü' type='button' open={open} onClick={onClick}>
            <div />
            <div />
            <div />
        </StyledBurger>
    )
}

export default Burger
