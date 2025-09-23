import styled from "styled-components";

const StyledApp = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 100vh;
    padding: max(env(safe-area-inset-top), 6rem) max(env(safe-area-inset-right), 5px) max(env(safe-area-inset-bottom), 5px) max(env(safe-area-inset-left), 5px);
    box-sizing: border-box;
    width: 100%;

    #version-tag {
        position: relative;
        bottom: 0;
        font-size: xx-small;
    }

    @media (max-width: ${({ theme }) => theme.mobile}) {
        padding-top: max(env(safe-area-inset-top), 2rem);
        max-height: calc(100vh - 6rem);
        overflow-y: scroll;
    }
`;

export default StyledApp;