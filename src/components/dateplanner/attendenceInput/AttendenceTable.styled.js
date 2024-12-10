import styled from "styled-components";

export const StyledAttendenceTable = styled.div`
    display: grid;

    .pending {
        font-style: italic;
        color: ${({theme}) => theme.yellow};
    }

    .sameDay {
        border-top: 1px dashed ${({theme}) => theme.primaryHover};
    }

    .diffWeek {
        border-top: 3px solid ${({theme}) => theme.primaryLight};
`

export const StyledEvent = styled.div`
    display: grid;
    grid-template-columns: auto 64px 64px;
    align-items: center;

    border-top: 1px solid ${({theme}) => theme.primaryLight};
    
    .event_type {
        grid-column-start: 1;
        grid-row-start: 1;
        padding: 5px;
        text-align: center;
    }

    .event_date {
        grid-column-start: 1;
        grid-row-start: 2;
        padding: 5px;
        text-align: center;
    }

    .event_day {
        grid-column-start: 1;
        grid-row-start: 3;
        padding: 5px;
        text-align: center;
    }

    .Terminzusage {
        grid-column-start: 2;
        grid-row-start: 1;
        grid-row-end: 4;
        justify-self: end;
    }

    .PlusOne {
        grid-column-start: 3;
        grid-row-start: 1;
        grid-row-end: 4;
        justify-self: end;
    }
`

export const StyledMultiEvent = styled.div`
    display: grid;
    grid-template-columns: auto auto [icon1 icon1];
    align-items: center;

    border-top: 1px solid ${({theme}) => theme.primaryLight};

    img {
        max-height: 64px;
        grid-column-start: 1;
        grid-row-start: 1;
        grid-row-end: 4;
        justify-self: start;
    }
    
    .event_type {
        grid-column-start: 2;
        grid-row-start: 1;
        padding: 5px;
        text-align: center;
    }

    .event_date {
        grid-column-start: 2;
        grid-row-start: 2;
        padding: 5px;
        text-align: center;
    }

    .event_day {
        grid-column-start: 2;
        grid-row-start: 3;
        padding: 5px;
        text-align: center;
    }

    .Terminzusage {
        grid-column-start: 3;
        grid-row-start: 1;
        grid-row-end: 4;
        justify-self: end;
    }

    .PlusOne {
        grid-column-start: 4;
        grid-row-start: 1;
        grid-row-end: 4;
        justify-self: end;
    }
`