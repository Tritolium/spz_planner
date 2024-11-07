import styled from "styled-components";

export const StyledEvent = styled.div`
    display: grid;

    border-top: 1px solid #ccc;

    justify-items: center;
    margin: 5px;
    padding: 2px;

    align-items: center;

    .event_type {
        justify-self: start;
        grid-column-start: 1;
        grid-row-start: 1;
        padding: 5px;
    }

    .event_location {
        grid-column-start: 2;
        grid-row-start: 1;
        padding: 5px;
    }

    .AttendenceInput {
        grid-column-start: 3;
        grid-row-start: 2;
        grid-row-end: 5;
        justify-self: end;
    }

    .event_date {
        justify-self: start;
        grid-column-start: 1;
        grid-row-start: 2;
        padding: 5px;
    }

    .event_begin {
        grid-column-start: 2;
        grid-row-start: 2;
        padding: 5px;
    }

    .departure {
        grid-column-start: 1;
        grid-row-start: 3;
        justify-self: start;
        padding: 5px;
    }

    .event_departure {
        grid-column-start: 2;
        grid-row-start: 3;
        padding: 5px;
    }

    .leave_dep {
        grid-column-start: 1;
        grid-row-start: 4;
        justify-self: start;
        padding: 5px;
    }

    .event_leave_dep {
        grid-column-start: 2;
        grid-row-start: 4;
        padding: 5px;
    }

    .clothing {
        grid-column-start: 1;
        grid-row-start: 5;
        justify-self: start;
        padding: 5px;
    }

    .event_clothing {
        grid-column-start: 2;
        grid-row-start: 5;
    }

    .plusone_input {
        grid-column-start: 3;
        grid-row-start: 5;
        justify-self: end;
    }

    .weather {
        grid-column-start: 1;
        grid-row-start: 6;
        justify-self: start;
        padding: 5px;
    }

    .weather_temp {
        grid-column-start: 2;
        grid-row-start: 6;
    }

    .weather_icon {
        grid-column-start: 3;
        grid-row-start: 6;
        justify-self: end;
    }

    .event_diagram {
        justify-self: start;
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 7;
    }

    .plusone_icon {
        grid-column-start: 1;
        grid-row-start: 8;
        justify-self: start;
        padding: 5px;
    }

    .plusone {
        grid-column-start: 2;
        grid-row-start: 8;
    }

    .fallback {
        background-image: linear-gradient(to right, transparent, grey);
        padding: 5px;
        margin: 5px;
        width: 100%;
        min-width: min(100px, 25vw);
        min-height: 28px;
        animation: blink 4s linear infinite;

        @keyframes blink {
            0% {opacity: 0.5;}
            50% {opacity: 1;}
            100% {opacity: 0.5;}
        }
    }

    .fallback_icon {
        animation: blink_icon 1s linear infinite;
        

        @keyframes blink_icon {
            0% {fill: white; transform: rotate(0deg);}
            50% {fill: grey;}
            100% {fill: white; transform: rotate(360deg);}
        }

        @keyframes rotate_icon {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(360deg);}
        }
    }
`