import styled from "styled-components"

const SubmitButton = styled.div`
    border-radius: 5px;
    padding: 5px 10px;
    background: ${({ theme }) => theme.primaryHover};
    color: ${({ theme }) => theme.primaryLight};
    margin: 2px;
    text-align: center;
    width: fit-content;
    font-size: 1.25em;
    cursor: default;

    :hover {
        color: ${({ theme }) => theme.primaryDark};
    }
`

export default SubmitButton