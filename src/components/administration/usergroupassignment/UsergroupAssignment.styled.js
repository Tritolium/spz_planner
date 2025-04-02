import styled from "styled-components"

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
        :nth-child(1) {
            z-index: 2;
        }
    }

    button {
        width: fit-content;
        align-self: center;
    }

    .IconWrapper {
        max-height: 1.8rem;
        max-width: 1.8rem;
        position: absolute;
        transform: translateX(-50%) translateY(-50%);
    }

    svg {
        height: 100%;
        width: 100%;
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