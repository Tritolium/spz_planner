import styled from "styled-components";

export const StyledHeating = styled.div`
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;

        label {
            display: flex;
            flex-direction: column;
            font-weight: bold;

            input, select {
                margin-top: 0.5rem;
                padding: 0.5rem;
                border: 1px solid ${({theme}) => theme.primaryDark};
                border-radius: 5px;
            }
        }

        button {
            align-self: flex-start;
            padding: 0.5rem 1rem;
            background-color: ${({theme}) => theme.primaryLight};
            color: ${({theme}) => theme.primaryDark};
            border: none;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                background-color: ${({theme}) => theme.primaryHover};
            }
        }
    }

    table {
        width: 100%;
        border-collapse: collapse;

        th, td {
            border: 1px solid ${({theme}) => theme.primaryLight};
            padding: 0.5rem;
            text-align: left;
        }

        th {
            background-color: ${({theme}) => theme.primaryLight};
        }
    }

    .fc-col-header {
        background-color: ${({theme}) => theme.primaryLight};
        color: ${({theme}) => theme.primaryDark};
    }

    .quick_action {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

`