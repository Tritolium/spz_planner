import styled from "styled-components";

export const StyledDashboard = styled.div`

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .infotext {
        font-size: smaller;
        font-weight: bold;
        border-radius: 5px;
        padding: 15px;
    }

    table {
        padding-top: 4pt;
        padding-bottom: 24pt;
    }
    img {
        height: 30pt;
    }

    tr {
        border: 1px solid white;
    }

    svg {
        height: 50pt;
        width: 50pt;
    }

    th {
        padding-top: 2.5vh;
    }
`

export const StyledFeedbackArea = styled.textarea`
    transition-property: transform, opacity, max-height;
    transition-duration: 0.75s;
    transition-timing-function: ease;
    
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
    opacity: ${({ open }) => open ? '1' : '0'};
    max-height: ${({ open }) => open ? '160px' : '0'};

`