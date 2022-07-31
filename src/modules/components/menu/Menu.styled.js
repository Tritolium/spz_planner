import styled from "styled-components";

export const StyledMenu =styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: ${({theme}) => theme.primaryDark};
    height: 100vh;
    text-align: left;
    padding: 2rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    transition: transform 0.3s ease-in-out;

    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
        width: 100%;
    }

    button {
        font-size: 1.5rem;
        font-weight: bold;
        letter-spacing: 0.05rem;
        color: ${({theme}) => theme.primaryDark};
        background: ${({theme}) => theme.primaryLight};
        border: none;
        border-radius: 15px;
        padding: 1px 5px;
        margin: 2px;
        text-align: center;
        transition: color 0.3s linear

        @media (max-width: ${({ theme }) => theme.mobile}) {
            font-size: 1.5rem;
            text-align: center;
        }

        &:hover {
            color: ${({ theme }) => theme.primaryHover};
        }
    }
`