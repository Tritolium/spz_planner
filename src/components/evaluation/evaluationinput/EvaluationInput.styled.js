import styled from "styled-components";

export const StyledEvaluationInput = styled.div`

    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    td {
        text-align: center;
        min-width: 32px;
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

    @media (max-width: ${({theme}) => theme.mobile}) {
        flex-direction: column;
        table {
            width: 100%;
        }
    }
`