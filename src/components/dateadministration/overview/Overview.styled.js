import styled from "styled-components"

export const StyledOverview = styled.div`
    display: block;
    text-align: center;
    select {
        padding: 5px;
        margin: 10px;
        border-radius: 5px;
    }

    a {
        padding: 5px;
        border-radius: 5px;
        background: ${({ theme }) => theme.primaryLight};
        color: ${({ theme }) => theme.primaryDark};
        text-decoration: none;
    }
`

export const StyledTable = styled.table`
    margin: 5px;
    border: 1px solid ${({ theme }) => theme.primaryLight};
    border-radius: 10px;
    /*border-collapse: collapse;*/
    border-spacing: 0;
    width: auto;

    display: table;

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

    img {
        max-width: 32px;
    }

    @media (max-width: ${({ theme }) => theme.mobile}) {
        font-size: 0.75em;
    }
`

export const StyledEventTable = styled(StyledTable)`
    display: table;
    @media (max-width: ${({theme}) => theme.mobile}) {
            display: none;
    }
`

export const StyledEventTableMobile = styled(StyledTable)`
    
    display: none;
    font-size: 0.75em;

    @media (max-width: ${({theme}) => theme.mobile}) {
            display: table;
    }
`