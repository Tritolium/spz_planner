import styled from "styled-components"

export const StyledWeatherIcon = styled.div`
    position: relative;
    cursor: help;
`

export const StyledTooltip = styled.p`
    color: ${({theme}) => theme.primaryDark};
    background: ${({theme}) => theme.primaryLight};

    position: absolute;
    right: 0;

    cursor: default;

    padding: 5px;
    border: 1px ${({theme}) => theme.primaryDark} solid;
    border-radius: 5px;
    white-space: nowrap;
    z-index: 5;
`