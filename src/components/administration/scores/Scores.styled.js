import styled from "styled-components";

export const StyledScores = styled.div`
    padding-left: env(safe-area-inset-left);
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    iframe {
        width: 100%;
        aspect-ratio: 210/297;
    }
`