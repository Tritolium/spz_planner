import styled from "styled-components"

export const StyledOverview = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    margin: auto;
    align-items: center;

    select {
        width: fit-content;
    }

    .pedro {
        width: 64px;
        height: 64px;
    }

    .spinner {
        animation: blink_icon 1s linear infinite;

        height: 64px;
        width: 64px;
        padding: 1px;

        @keyframes blink_icon {
            0% {fill: white; transform: rotate(0deg);}
            50% {fill: grey;}
            100% {fill: white; transform: rotate(360deg);}
        }

        @keyframes rotate_icon {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(360deg);}
        }
    }
`

export const StyledOverviewTable = styled.div`
    display: grid;
    border-bottom: 1px solid ${({ theme }) => theme.primaryLight};
    overflox: auto;

    .Header {
        position: sticky;
        top: 0;
        z-index: 8;
        background-color: ${({ theme }) => theme.primaryDark};
    }

    .Date {
        grid-row: 1;
        grid-column: 1;
    }

    .NameTag {
        grid-row: 1;
        font-weight: bold;
        padding: 2px;
        cursor: pointer;
        border: 1px solid ${({ theme }) => theme.primaryLight};
    }

    .NameTagActive {
        grid-row: 1;
        font-weight: bold;
        padding: 2px;
        cursor: pointer;
        background-color: ${({ theme }) => theme.primaryLight};
        color: ${({ theme }) => theme.primaryDark};
        border-radius: 5px;
        border: 1px solid ${({ theme }) => theme.primaryDark};
        cursor: pointer;
    }

    .DateTag {
        grid-column: 1;
        text-align: center;
        border-left: 1px solid ${({ theme }) => theme.primaryLight};
        border-top: 1px solid ${({ theme }) => theme.primaryLight};
        border-right: 1px solid ${({ theme }) => theme.primaryLight};
        position: sticky;
        left: 0;
        z-index: 5;
        background-color: ${({ theme }) => theme.primaryDark};
    }

    .AttendenceTag {
        position: relative;
        min-width: 32px;
        min-height: 32px;
        padding: 5px;

        border-left: 1px solid ${({ theme }) => theme.primaryLight};
        border-top: 1px solid ${({ theme }) => theme.primaryLight};

        :nth-child(1) {
            z-index: 3;
        }
    }

    .Last {
        border-right: 1px solid ${({ theme }) => theme.primaryLight};
    }

    .IconWrapper {
        width: 32px;
        height: 32px;
        position: absolute;

        left: 50%;
        top: 50%;

        transform: translateX(-50%) translateY(-50%);
    }

    .PlusOneIcon {
        width: 18px;
    }

    @media (max-width: ${({ theme }) => theme.mobile}) {
        display: none;
    }
`

export const StyledEvalTable = styled.table`
    border-collapse: collapse;
    position: relative;
    margin: 0 2px 0 2px;

    tr {
        max-height: 100px;
    }

    td {
        text-align: center;
        border: 1px solid ${({ theme }) => theme.primaryLight};

        > img {
            min-width: 15px;
            width: 100%;
            max-width: 30px;
        }
    }

    .Header {
        position: sticky;
        top: 0;
        z-index: 8;
        background-color: ${({ theme }) => theme.primaryDark};
    }

    .okay {
        color: ${({ theme }) => theme.green};
    }

    .prob {
        color: ${({ theme }) => theme.lightgreen};
    }

    .warning {
        color: ${({ theme }) => theme.yellow};
    }

    .critical {
        color: ${({ theme }) => theme.red};
    }

    @media (max-width: ${({ theme }) => theme.mobile}) {
        thead, td {
            display: none;
        }
    }
`

export const StyledEvalDiagram = styled.div`
    @media (min-width: ${({theme}) => theme.mobile}) {
        div {
            display: none;
        }
    }
`