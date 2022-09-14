import React from 'react'
import { bool, func } from 'prop-types'
import { StyledBurger } from "./Burger.styled"

const Burger = ({open, setOpen}) => {
    return(
        <StyledBurger id='main_menu' title='Hauptmenü' type='button' open={open} onClick={() => setOpen(!open)}>
            <div />
            <div />
            <div />
        </StyledBurger>
    )
}

Burger.propTypes = {
    open: bool.isRequired,
    setOpen: func.isRequired
}

export default Burger