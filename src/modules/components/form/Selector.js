import styled from "styled-components"

const Selector = styled.nav`
    margin: 2px;
    padding: 2px;
    white-space: nowrap;
    border: 1px solid ${({ theme }) => theme.primaryLight};
    border-radius: 10px;
    overflow-y: scroll;
    max-height: 75vh;
    min-width: fit-content;
    width: auto;
    max-width: fit-content;


    @media (max-width: ${({ theme }) => theme.mobile}) {
        white-space: normal;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background: none;
    }

    ::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.primaryLight};
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.primaryHover};
    }
`

export default Selector