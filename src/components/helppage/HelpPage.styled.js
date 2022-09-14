import styled from "styled-components";

export const StyledHelpPage = styled.div`
    padding: 15px;

    div {
        border-bottom: 1px solid ${({ theme }) => theme.primaryLight};

        img {
            height: 1rem;
        }
    }
`