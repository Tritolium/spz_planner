import styled from 'styled-components';

export const StyledRole = styled.div`
    display: flex;
    flex-direction: row;
`

export const StyledRoleForm = styled.form`
    display: grid;
    grid-template-columns: auto auto;

    width: fit-content;
    margin: 5px;

    input, textarea {
        width: 100%;
        padding: 5px;
        margin: 1px;
        border-radius: 5px;
        border: 1px solid ${({ theme }) => theme.primaryLight};
        color: ${({ theme }) => theme.primaryDark};
        background-color: ${({ theme }) => theme.primaryLight};
    }
`