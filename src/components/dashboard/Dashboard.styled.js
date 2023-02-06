import styled from "styled-components";

export const StyledDashboard = styled.div`
    padding-top: max(env(safe-area-inset-top), 15px);
    padding-right: max(env(safe-area-inset-right), 15px);
    padding-bottom: max(env(safe-area-inset-bottom), 15px);
    padding-left: max(env(safe-area-inset-left), 15px);

    #infotext {
        font-size: smaller;
        font-weight: bold;
        border-radius: 5px;
        padding: 15px;
    }

    table {
        padding-top: 4pt;
        padding-bottom: 24pt;
    }
    img {
        height: 30pt;
    }

    svg {
        height: 30pt;
        width: 30pt;
    }
`