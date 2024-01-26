import styled from "styled-components";

interface Props {
    direction: "row" | "column";
}

const FlexOrBlockView = styled.div<Props>`
    display: flex;

    ${(props) => `flex-direction: ${props.direction}`}

    @media (orientation: portrait) {
        flex-direction: column;

        & > div:not(:first-of-type) {
            margin-top: 1rem;
        }
    }
`;

export default FlexOrBlockView;