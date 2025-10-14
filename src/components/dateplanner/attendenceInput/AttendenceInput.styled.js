import styled from "styled-components"

export const StyledAttendenceInput = styled.div`
    position: relative;
    height: 64px;
    width: 64px;
    z-index: 2;

    .IconWrapper {
        position: absolute;
    }

    .active_no {
        translate: ${({active}) => active ? "-196px" : "0"};
        opacity: ${({active}) => active ? "1" : "0"};
    }

    .active_yes {
        opacity: ${({active}) => active ? "1" : "0"};
    }

    .active_maybe {
        translate: ${({active}) => active ? "-128px" : "0"};
        opacity: ${({active}) => active ? "1" : "0"};
    }

    .active_delayed {
        translate: ${({active}) => active ? "-64px" : "0"};
        opacity: ${({active}) => active ? "1" : "0"};
    }

    .active_none {
        display: none;
    }

    .not_selected {
        opacity: 0;
    }

    .selected {
        opacity: 1;
    }

    
    .ButtonWrapper {
        position: absolute;
        height: 64px;
        width: 64px;

        transition: translate 0.3s linear, opacity 0.5s linear;

        :nth-child(1) {
            z-index: 3;
        }

        .IconWrapper {
            position: absolute;
            height: 64px;
            width: 64px;
        }
    }

    .LoadingSpinner {
        animation: spin 1s linear infinite;

        height: 64px;
        width: 64px;

        @keyframes spin {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(360deg);}
        }
    }
`