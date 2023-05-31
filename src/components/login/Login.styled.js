import styled from "styled-components";

const StyledLogin = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    #passwd {
        color: ${({theme}) => theme.primaryDark};
        background: ${({theme}) => theme.primaryDark};
        border: none;
        cursor: default;
    }

    button {
        width: max-content;
    }
`

export default StyledLogin