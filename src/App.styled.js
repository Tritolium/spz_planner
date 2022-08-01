import styled from "styled-components";

export const StyledApp = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 100vh;
    padding: calc(2.5% + 2rem) 0 2rem 0;

    @media (max-width: ${({theme}) => theme.mobile}) {
        padding-top: calc(10% + 2rem);
    }

    .Namefield {
        font-size: 1.5rem;
        position: absolute;
        top: 5%;
        right: 2rem;
        z-index: 2;

        @media (max-width: ${({theme}) => theme.mobile}) {
            display: none;
        }
    }
`