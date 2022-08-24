import styled from "styled-components"

const SelectorItem = styled.div`
    user-select: none;
    cursor: pointer;
    padding: 2px;
    border-radius: 5px;

    &:hover {
        background: ${({ theme }) => theme.primaryHover};
    }
`

export default SelectorItem