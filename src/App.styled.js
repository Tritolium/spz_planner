import styled from "styled-components";

export const StyledApp = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 100vh;
    padding: max(env(safe-area-inset-top), 90px) max(env(safe-area-inset-right), 5px) env(safe-area-inset-bottom) max(env(safe-area-inset-left), 5px);
    box-sizing: border-box;
    width: 100vw;

    @media (max-width: ${({theme}) => theme.mobile}) {
        padding-top: calc(10% + 2rem);
    }

    .Namefield {
        font-size: 1.5rem;
        position: absolute;
        top: 0.5rem;
        right: 2rem;
        z-index: 2;
        div {
            @media (max-width: ${({theme}) => theme.mobile}) {
                display: none;
            }
        }
    }
`