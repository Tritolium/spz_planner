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
    }

    .event_location {
        grid-column-start: 2;
        grid-row-start: 1;
    }

    .Terminzusage {
        grid-column-start: 3;
        grid-row-start: 2;
        grid-row-end: 5;
        justify-self: end;
    }

    .event_date {
        justify-self: start;
        grid-column-start: 1;
        grid-row-start: 2;
    }

    .event_begin {
        grid-column-start: 2;
        grid-row-start: 2;
    }

    .departure {
        grid-column-start: 1;
        grid-row-start: 3;
        justify-self: start;
    }

    .event_departure {
        grid-column-start: 2;
        grid-row-start: 3;
    }

    .leave_dep {
        grid-column-start: 1;
        grid-row-start: 4;
        justify-self: start;
    }

    .event_leave_dep {
        grid-column-start: 2;
        grid-row-start: 4;
    }

    .clothing {
        grid-column-start: 1;
        grid-row-start: 5;
        justify-self: start;
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
    }

    .plusone {
        grid-column-start: 2;
        grid-row-start: 8;
    }
`