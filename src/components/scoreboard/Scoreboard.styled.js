import styled from "styled-components";

export const StyledScoreboard = styled.div`
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    iframe {
        max-width: 215mm;
        width: 100%;
        aspect-ratio: 210/297;
    }
`