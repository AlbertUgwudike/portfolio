import styled from "styled-components";

export const HorizontalScore = styled.div`
    background-color: var(--secondary);
    height: 5px;
    position: sticky;
    top: 37px;
    z-index: 1000;
`;

export const Title = styled.div`
    font: var(--xl-font);
    color: var(--secondary);
`;

export const Subtitle = styled.div`
    font: var(--bg-font);
    color: var(--secondary);
`;

export const Content = styled.div`
    max-width: 1000px;
    margin: auto;
    padding: 0;
`;
