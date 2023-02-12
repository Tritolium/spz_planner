import styled from "styled-components";

export const StyledDashboard = styled.div`

    width: 100%;

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

    svg {
        height: 50pt;
        width: 50pt;
    }

    th {
        padding-top: 2.5vh;
    }
`

export const StyledFeedbackArea = styled.textarea`
    transition: transform 0.3s ease-in-out;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
    visibility: ${({ open }) => open ? 'visible' : 'hidden'};
`