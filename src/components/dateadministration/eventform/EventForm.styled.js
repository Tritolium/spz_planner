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

        .event-selector {
            transition: transform 200ms ease, opacity 200ms ease, max-height 200ms ease;
            transform-origin: left center;
        }

        &[data-event-selected="true"] .event-selector {
            transform: translateX(-110%);
            opacity: 0;
            pointer-events: none;
            max-height: 0;
            height: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            border: 0;
        }
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
