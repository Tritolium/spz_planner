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

        .ButtonWrapper {
            display: inline-block;
            height: 1.5rem;
            width: 1.5rem;

            position: relative;
            top: 4px;

            transition: translate 0.3s linear, opacity 0.5s linear;

            :nth-child(1) {
                z-index: 3;
            }

            .IconWrapper {
                position: absolute;
                height: 1.5rem;
                width: 1.5rem;
            }
    }
`