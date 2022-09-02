import styled from "styled-components"

export const StyledMemberForm = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
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