import styled from 'styled-components';

export interface Props {
    hasError?: boolean;
}

const Input = styled.input<Props>`
    resize: none;
    appearance: none;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding: 1rem;
    max-width: 360px;

    color: #fff;

    background: #161616;
    border: 1px solid #3D3D3D;
    border-radius: 12px;

    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    display: flex;
    align-items: center;
    letter-spacing: 0.02em;

    transition: 0.15s ease-in-out;

    &:required, &:invalid {
        box-shadow: 0 0 #0000;
    }

    &:not(:disabled):not(:read-only):focus {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        ${props => !props.hasError ? "border-color: rgb(209 213 219)" : "border-color: rgb(252 165 165)"};
    }

    &:disabled {
        opacity: 0.75;
    }

    ${props => props.hasError && `
        color: rgb(185 28 28);
        border-color: rgb(248 113 113);
    `};

    &::placeholder {
        color: rgba(124, 124, 124, 0.7);
        opacity: 1
    }
`;

export default Input;