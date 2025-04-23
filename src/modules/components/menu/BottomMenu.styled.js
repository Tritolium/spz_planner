import styled from "styled-components"

export const StyledBottomMenu = styled.footer`
    position: fixed;
    bottom: 0;
    display: none;
    justify-content: space-around;
    height: 3rem;
    width: 100%;
    background-color: ${({theme}) => theme.primaryDark};
    z-index: 8;

    @media (max-width: ${({theme}) => theme.mobile}) {
        display: flex;
        padding-bottom: env(safe-area-inset-bottom);
    }
`

export const StyledMenuItem = styled.button`
    background: ${({activeView, theme}) => activeView ? theme.primaryHover : theme.primaryDark};
    color: ${({theme}) => theme.primaryLight};
    border: ${({theme}) => theme.primaryLight} solid 1px;
    height: 100%;
    cursor: pointer;
    flex: 1;
    font-size: clamp(8pt, 3vw, 16pt);
    padding: 1px;
    white-space: wrap;
`