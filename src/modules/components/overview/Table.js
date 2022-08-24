import styled from "styled-components";

export const Table = styled.table`
    margin: 5px;
    border: 1px solid ${({ theme }) => theme.primaryLight};
    border-radius: 10px;
    border-spacing: 0;
    width: auto;

    th {
        border-bottom: 1px solid ${({ theme }) => theme.primaryLight};
        padding: 5px;
    }

    td {
        border-top: 1px solid ${({ theme }) => theme.primaryLight};
        padding: 5px;
        white-space: nowrap;
    }

    td:first-child {
        white-space: normal;
    }
`