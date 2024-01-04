import styled from "styled-components";

export const StyledPlusOne = styled.div.attrs(props => ({
    className: props.className,
    }))`
    position: relative;
    height: 64px;
    width: 64px;

    :nth-child(1) {
        z-index: 3;
    }

    :nth-child(1) {
        z-index: 2;
    }

    .IconWrapper {
        position: absolute;
        max-width: 64px;
    }

    .UserIcon {
        top: 25%;
        left: 25%;
        height: 50%;
        width: 50%;
    }

    svg {
        top: 0;
        height: 100%;
        width: 100%;
    }
`