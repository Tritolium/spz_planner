import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
    }
    *, *::after, *::before {
        box-sizing: border-box;
    }

    header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: relative;
        font-size: 1.5rem;
        padding: 0.5rem 2rem;
        height: 3rem;
        @media (max-width: ${({theme}) => theme.mobile}) {
            div {
                display: none;
            }
        }
    }

    body {
        align-items: center;
        background: ${({theme}) => theme.primaryDark};
        color: ${({theme}) => theme.primaryLight};
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        height: 100vh;
        justify-content: flex-start;
        text-rendering: optimizeLegibility;
        forced-color-adjust: none;
    }

    button {
        font-size: 1rem
    }
`