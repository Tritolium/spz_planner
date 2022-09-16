import styled from "styled-components";

const HeaderMenu = styled.nav`
    display: flex;
    background-color: ${({ theme }) => theme.primaryHover};
    position: relative;
    padding: 5px;
    margin: 5px;
    border-radius: 20px;

    flex-wrap: wrap;
    justify-content: center;
`

export default HeaderMenu