import styled from "styled-components";

export const StyledUsergroupAssignment = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 100%;

    img {
        max-height: 1.5rem;
    }

    td {
        text-align: center;
    }

    button {
        width: fit-content;
        align-self: center;
    }
`

export const StyledTableHeader = styled.th`
    display: table-cell;
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: none;
    }
`

export const StyledMobileTableHeader = styled.th`
    display: none;
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: table-cell;
    }
`

export const StyledUsergroupLegend = styled.div`
    display: none;

    padding: 5px;
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: flex;
        flex-direction: column;
    }
`