import styled from "styled-components";

export const StyledSettings = styled.div`
    #secureNotifier {
        position: absolute;
        top: 4rem;
        left: 4rem;
        padding: 10px;
    }

    form {
        display: flex;
        flex-direction: column;
        
        div {
            display: flex;
            align-items: center;
        }

        button{
            width: max-content;
        }
    }
`