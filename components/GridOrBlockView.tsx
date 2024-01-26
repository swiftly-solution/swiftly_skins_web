import styled from "styled-components";

interface Props {
    gridtype: "column" | "row";
    gridnumber: number;
    gapbetween: number;
    tocenter?: boolean;
}

const GridOrBlockView = styled.div<Props>`
    display: grid;

    ${(props) => `
        grid-template-${props.gridtype}s: repeat(${props.gridnumber}, 1fr);
        grid-column-gap: ${props.gapbetween}px;
        grid-row-gap: ${props.gapbetween}px;
    `}

    ${(props) => props.tocenter ? `
        margin-left: auto;
        margin-right: auto;
    ` : ``}

    @media (orientation: portrait) {
        display: block;

        & div:not(:first-of-type) {
            margin-top: 1rem;
        }
    }
`;

export default GridOrBlockView;