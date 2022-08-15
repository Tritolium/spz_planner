import styled from "styled-components"

export const StyledMemberForm = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
`

export const StyledSelector = styled.div`
    margin: 2px;
    padding: 2px;
    width: auto;
    white-space: nowrap;
    border: 1px solid ${({ theme }) => theme.primaryLight};
    border-radius: 10px;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        white-space: normal;
    }
`

export const StyledForm = styled.form`
    display: block;
    width: 100%;
    padding: 5px;
`

export const StyledMember = styled.div`
    user-select: none;
    cursor: pointer;
    padding: 2px;
    border-radius: 5px;

    &:hover {
        background: ${({ theme }) => theme.primaryHover};
    }
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