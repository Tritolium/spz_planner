import styled from "styled-components";

const StyledLogin = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 6cm;
    max-height: 4cm;
    width: 90vw;
    height: 25vw;

    input {
        margin: 1px;
        width: 100%;
        height: 33%;
    }

    button {
        width: max-content;
        margin: 1px;
    }
`

export default StyledLogin