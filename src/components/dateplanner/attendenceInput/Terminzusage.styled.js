import styled from "styled-components";

export const StyledTerminzusage = styled.div`

    position: relative;
    height: 64px;
    width: 64px;

    .IconWrapper {
        position: absolute;
        :nth-child(1) {
            z-index: 2;
        }
    }

    svg {
        height: 100%;
        width: 100%;
    }
`