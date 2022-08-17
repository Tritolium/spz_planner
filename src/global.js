import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
    }
    *, *::after, *::before {
        box-sizing: border-box;
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
    }

    button {
        font-size: 1rem
    }
`