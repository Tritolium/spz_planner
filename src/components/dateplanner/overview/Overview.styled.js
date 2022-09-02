import styled from "styled-components";

export const StyledOverview = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    margin: auto;
`

export const StyledOverviewTable = styled.table`

    table-layout: fixed;

    border-collapse: collapse;
    position: relative;
    overflow: scroll;
    align-self: flex-start;
    margin: 0 2px 0 2px;

    td {

        border: 1px solid ${({ theme }) => theme.primaryLight};
        padding: 2px;
        text-align: center;

        img {
            min-width: 15px;
            width: 100%;
            max-width: 30px;
        }
    }

    th {

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