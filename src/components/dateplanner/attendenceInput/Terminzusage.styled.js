import styled from "styled-components";

export const StyledTerminzusage = styled.div`

    position: relative;
    height: 64px;
    width: 64px;

    :nth-child(1) {
        z-index: 3;
    }

    :nth-child(1) {
        z-index: 2;
    }

    .IconWrapper {
        position: absolute;
    }

    svg {
        height: 100%;
        width: 100%;
    }

    .LoadingSpinner {
        animation: spin 1s linear infinite;

        @keyframes spin {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(360deg);}
        }
    }
`