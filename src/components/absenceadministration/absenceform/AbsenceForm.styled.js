import styled from "styled-components"

export const StyledAbsenceForm = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    .weekselect {

        max-width: 25%;

        display: grid;
        grid-template-columns: repeat(7, auto);

        justify-items: center;

        label {
            grid-row: 1;
            min-width: 25px;
            text-align: center;
        }

        input {
            grid-row: 2;
            margin: 0 auto;
        }
    }

    @media (max-width: ${({ theme }) => theme.mobile}) {
        flex-direction: column;
    }
`

export const StyledForm = styled.form`
    display: block;
    width: 100%;
    padding: 5px;
`

export const FormBox = styled.div`
    display: block;
    padding: 2px;
    label {
        float: left;
        width: 25%;
        min-width: 100px;
    }
`