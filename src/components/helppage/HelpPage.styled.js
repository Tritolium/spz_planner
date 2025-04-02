import styled from "styled-components"

export const StyledHelpPage = styled.div`
    padding: 15px;

    h1 {
        font-size: 1.5rem;
    }

    h2 {
        font-size: 1.25rem;
    }

    article {
        border-bottom: 1px solid ${({ theme }) => theme.primaryLight};

        img {
            height: 1rem;
        }
    }
`