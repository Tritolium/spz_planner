import styled from "styled-components";

export const StyledOverview = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    margin: auto;
    align-items: center;

    select {
        width: fit-content;
    }
`

export const StyledOverviewTable = styled.table`

    table-layout: fixed;

    border-collapse: collapse;
    position: relative;
    overflow: scroll;
    align-self: flex-start;
    margin: 0 2px 0 2px;

    tbody {
        overflow-x: scroll;
    }

    td {
        border: 1px solid ${({ theme }) => theme.primaryLight};
        padding: 2px;
        text-align: center;
        position: relative;
        min-width: 32px;

        :nth-child(1) {
            z-index: 3;
        }

        :nth-child(1) {
            z-index: 2;
        }
        
        .IconWrapper {
            max-width: 32px;
            min-height: 1.5em;
            max-height: 32px;
            position: absolute;

            transform: translateX(-50%) translateY(-50%);
        }
    }

    .Header {
        min-width: 15px;
        max-width: 40px;
        cursor: pointer;
    }

    .Tooltip {
        background-color: ${({ theme }) => theme.primaryLight};
        color: ${({ theme }) => theme.primaryDark};
        border-radius: 5px;
        border: 1px solid ${({ theme }) => theme.primaryDark};
        cursor: pointer;
    }

    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: none;
    }
`

export const StyledEvalTable = styled.table`
    border-collapse: collapse;
    position: relative;
    margin: 0 2px 0 2px;

    tr {
        max-height: 100px;
    }

    td {
        text-align: center;
        border: 1px solid ${({ theme }) => theme.primaryLight};

        > img {
            min-width: 15px;
            width: 100%;
            max-width: 30px;
        }
    }

    @media (max-width: ${({ theme }) => theme.mobile}) {
        thead, td {
            display: none;
        }
    }
`

export const StyledEvalDiagram = styled.div`
    @media (min-width: ${({theme}) => theme.mobile}) {
        div {
            display: none;
        }
    }
`