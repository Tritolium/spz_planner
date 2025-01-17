import styled from "styled-components";

export const StyledAssociationAssignment = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    align-items: start;
    position: relative;

    button {
        width: fit-content;
        align-self: center;
    }

    .selected {
        background-color: ${({ theme }) => theme.primaryLight};
        color: ${({ theme }) => theme.primaryDark};
    }

    form {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
`