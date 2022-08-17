import styled from "styled-components";

export const StyledOverview = styled.div`
    display: block;
    text-align: center;
    select {
        padding: 5px;
        margin: 10px;
        border-radius: 5px;
    }
`

const StyledTable = styled.table`
    border: 1px solid ${({ theme }) => theme.primaryLight};
    border-collapse: collapse;

    tr {
        border: 1px solid ${({ theme }) => theme.primaryLight};
    }

    th {
        border: 1px solid ${({ theme }) => theme.primaryLight};
        padding: 4px;
    }

    td {
        padding: 4px;
        text-align: center;
    }
`

export const StyledDesktopTable = styled(StyledTable)`
    display: table;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: none;
    }
`

export const StyledMobileTable = styled(StyledTable)`
    display: none;

    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: table;
    }
`