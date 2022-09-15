import styled from "styled-components";

const SubmitButton = styled.div`
    border-radius: 15px;
    padding: 1px 5px;
    background: ${({ theme }) => theme.primaryHover};
    color: ${({ theme }) => theme.primaryLight};
    margin: 2px;
    text-align: center;
    width: fit-content;

    cursor: default;

    :hover {
        color: ${({ theme }) => theme.primaryDark};
    }
`

export default SubmitButton