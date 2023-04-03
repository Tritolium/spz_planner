import styled from "styled-components";

export const StyledOrderAdministration = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    @media (min-width: ${({theme}) => theme.mobile}) {
        align-items: center;
    }
    align-items: stretch;
    

    #thead-desktop {
        display: none;
        @media (min-width: ${({theme}) => theme.mobile}) {
            display: table-header-group;
        }
    }

    #thead-mobile {
        display: table-header-group;
        @media (min-width: ${({theme}) => theme.mobile}) {
            display: none;
        }
    }

    table {
        @media (min-width: ${({theme}) => theme.mobile}) {
            width: fit-content;

            th {
                padding: 5px;
            }
        }
        
        td {
            text-align: center;
        }
    }
`