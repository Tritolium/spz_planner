import styled from "styled-components"

const Button = styled.button`
    font-size: ${({font_size}) => font_size};
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
        font-size: ${({font_size}) => font_size};
        text-align: center;
    }

    &:hover {
        color: ${({ theme }) => theme.primaryHover};
    }
`

export default Button