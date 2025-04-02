import styled from "styled-components"

export const StyledAbsenceInput = styled.form`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;

    @media screen and (max-width: 720px) {
        flex-direction: column;
        > select {
            width: 100%
        }
    }

    > select {
        max-height: 40px;
        padding: 5px;
        margin: 5px;
    }
    > img {
        padding: 2px;
        min-height: 21px;
        height: 10vh;
        max-height: 64px;
    }
`