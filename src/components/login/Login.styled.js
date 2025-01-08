import styled from "styled-components";

const StyledLogin = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 6cm;
    max-height: 4cm;
    width: 90vw;

    input {
        margin: 1px;
        width: 100%;
        height: 33%;
        min-height: 0.5cm;
    }

    button {
        width: max-content;
        margin: 1px;
    }

    #pwreq {
        background-color: ${props => props.theme.primaryDark};
        color: ${props => props.theme.primaryHover};
        border: none;
    }
`

export default StyledLogin