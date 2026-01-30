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

    .form-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .save-indicator {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        color: ${({theme}) => theme.green};
        opacity: 0;
        transform: scale(0.7);
        transition: opacity 180ms ease, transform 180ms ease;
    }

    .save-indicator.visible {
        opacity: 1;
        transform: scale(1);
    }
`
