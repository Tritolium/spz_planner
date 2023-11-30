import styled from "styled-components";

export const StyledEvaluationOverview = styled.div`

    td, th {
        text-align: center;
        min-width: 32px;
    }

    td:nth-child(1), td:nth-child(2), th:nth-child(1) {
        border-right: 1px solid ${({theme}) => theme.primaryLight};
    }

    td:nth-last-child(3), th:nth-last-child(3) {
        border-left: 1px solid ${({theme}) => theme.primaryLight};
    }

    :nth-child(1) {
        z-index: 3;
    }

    :nth-child(1) {
        z-index: 2;
    }    

    .IconWrapper {
        min-width: 1.5em;
        max-width: 32px;
        min-height: 1.5em;
        max-height: 32px;
        position: absolute;

        transform: translateX(-50%) translateY(-50%);
    }
`