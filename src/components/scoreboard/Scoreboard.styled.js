import styled from "styled-components";

export const StyledScoreboard = styled.div`
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    div {
        width: 100%;
        display: flex;
        flex-direction: column;


        a, a:active {
            width: fit-content;
            border-radius: 5px;
            padding: 2px;
            background: ${({theme}) => theme.primaryLight};
            color: ${({theme}) => theme.primaryDark};
        }
    }

    nav {
        display: flex;
        flex-direction: column;    

        input[type=text] {
            margin: 2px;
            border-radius: 8px;
            border-width: 0;
            padding-left: 8px;
            max-width: calc(100% - 8px);
        }
        div {
            text-align: left;
        }
    }

    iframe {
        max-width: 215mm;
        width: 100%;
        aspect-ratio: 210/297;
    }
`