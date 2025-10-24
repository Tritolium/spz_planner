import styled from "styled-components"

export const StyledDashboard = styled.div`

    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .iosInstruction {
        color: red;
        font-size: 1.5em;

        svg {
            animation: none;
            stroke: ${({theme}) => theme.primaryLight};
            color: ${({theme}) => theme.primaryLight};
            height: 1.5em;
            width: 1.5em;
        }
    }

    table {
        padding-top: 4pt;
        padding-bottom: 24pt;
        border-collapse: collapse;
        cursor: default;
    }
    img {
        height: 30pt;
    }

    .event_header {
        margin-top: 2vh;
        margin-bottom: 1vh;
        font-weight: bold;
        text-align: center;
    }

    .Plusone_icon {
        height: 25pt;
        width: 25pt;
    }

    th {
        padding-top: 2.5vh;
    }

    .CanceledEvent {
        font-style: italic;
        color: ${({theme}) => theme.lightred};
    }

    .PendingEvent {
        font-style: italic;
        color: ${({theme}) => theme.orange};
    }
`

export const StyledInfoText = styled.p`
    font-size: smaller;
    font-weight: bold;
    border-radius: 5px;
    padding: 15px;

    svg {
        height: 15em;
        width: 15em;
        stroke: red;
        animation: blink 1s linear infinite;
    }

    @media (min-width: ${({theme}) => theme.medium}) {
        display: none;
    }

    @keyframes blink {
        0%{stroke: ${({theme}) => theme.primaryLight};}
        50%{stroke: red;}
        100%{stroke: ${({theme}) => theme.primaryLight};}
    }
`

export const StyledChangelog = styled.div`
    font-size: smaller;
    padding-inline-start: 1.5em;
    padding-inline-end: 1.5em;

    max-width: 450px;

    li {
        padding: 1em 0 1em 0;
    }

    .Previous {
        display: none;
    }
`

export const StyledFeedbackArea = styled.textarea`
    transition-property: transform, opacity, max-height;
    transition-duration: 0.75s;
    transition-timing-function: ease;
    
    transform: ${({ open }) => open ? "translateX(0)" : "translateX(-100%)"};
    opacity: ${({ open }) => open ? "1" : "0"};
    max-height: ${({ open }) => open ? "160px" : "0"};

`

export const StyledVersionDiagramm = styled.div`
    width: 100vw;
    max-width: 400px;
`

export const StyledDisplayDiagram = styled.div`
    width: 100vw;
    height: 25vh;
    max-width: 400px;
    max-height: 50px;
    display: flex;
    justify-content: center;
`