import styled from "styled-components";

export const StyledEventInfo = styled.div`
    background: ${({theme}) => theme.primaryLight};
    color: ${({theme}) => theme.primaryDark};
    padding: 7px;
    border-radius: 7px;

    width: 95%;
    max-width: 10cm;
    height: 80vh;
    position: relative;

    #chat {
        max-height: 80%;
        overflow-y: scroll;
        scroll-behavior: smooth;
        display: flex;
        flex-direction: column;
    }

    #chatheader {
        height: 1cm;
        max-height: 5%;
        position: relative;
    }

    .IconWrapper {
        max-height: 100%;
        width: 20px;
        height: 20px;
        right: 0;
        top: 0;
        position: absolute;
    }

    form {
        max-height: 10%;
        width: calc(100% - 14px);
        position: absolute;
        
        bottom: 7px;

        textarea {
            height: 100%;
            width: 75%;
            resize: none;
        }

        button {
            position: absolute;
            margin: 1px;

            background: ${({theme}) => theme.primaryDark};
            color: ${({theme}) => theme.primaryLight};

            width: 24%;
            right: 0;
        }
    }
`

export const StyledBlogEntry = styled.div`
    padding-bottom: 5px;

    width: 90%;

    .content {
        border: 1px black solid;
        border-radius: 5px;
        padding: 5px;
    }
    .tags {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: x-small;
    }
`

export const StyledOwnBlogEntry = styled(StyledBlogEntry)`
    align-self: end;
`