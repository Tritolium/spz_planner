import styled from "styled-components"

const Selector = styled.nav`
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

export default Selector