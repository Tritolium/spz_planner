import styled from "styled-components"

export const StyledBurger = styled.button`
    position: absolute;
    top: 2rem;
    left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;

    &focus {
        outline: none;
    }

    :nth-child(1) {
        rotate: ${props => props.open ? "45deg" : "0"};
    }

    :nth-child(2) {
        opacity: ${({open}) => open ? "0" : "1"};
        translate: ${({open}) => open ? "25px" : "0"};
    }

    :nth-child(3) {
        rotate: ${props => props.open ? "-45deg" : "0"};
    }

    @media (max-width: ${({ theme }) => theme.mobile}) {
        top: 1rem;
        left: 1rem
    }

    div {
        width: 2rem;
        height: 0.25rem;
        background: ${({ theme }) => theme.primaryLight};
        border-radius: 10px;
        transition: all 0.25s linear;
        position: relative;
        transform-origin: 1px;
    }
`