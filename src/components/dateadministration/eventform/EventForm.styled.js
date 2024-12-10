import styled from "styled-components"

export const StyledEventForm = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    select {
        padding: 2px;
        margin: 2px;
        border-radius: 5px;
    }

    img {
        height: 35pt;
    }

    @media (max-width: ${({theme}) => theme.mobile}) {
        flex-direction: column;
    }

    .confirmed {
        color: ${({theme}) => theme.primaryLight};
        font-style: normal;
    }

    .pending {
        color: ${({theme}) => theme.primaryLight};
        font-style: italic;
    }

    .declined {
        color: ${({theme}) => theme.lightred};
        font-style: italic;
    }

    .canceled {
        color: ${({theme}) => theme.red};
        font-style: italic;
    }
`