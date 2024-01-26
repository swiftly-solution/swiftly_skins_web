import styled from 'styled-components';

export type ButtonColor = 'green' | 'red' | 'secondary';
export type ButtonTextColor = "white" | "green" | "red" | "yellow";
export type ButtonSize = 'small' | 'large' | 'xlarge';

interface Props {
    size?: ButtonSize;
    color?: ButtonColor;
    textcolor?: ButtonTextColor;
    disabled?: boolean;
}

const Button = styled.div<Props>`
    background: #1C1C1C;
    border: 1px solid #3D3D3D;
    border-radius: 12px;
    transition: 0.2s ease-in-out;
    width: 100%;

    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;

    display: flex;
    justify-content: center;
    align-items: center;

    ${(props) => props.textcolor == "white" && `color: #ffffff;`}
    ${(props) => props.textcolor == "green" && `color: #179600;`}
    ${(props) => props.textcolor == "red" && `color: #9c0202;`}
    ${(props) => props.textcolor == "yellow" && `color: #e8e000;`}

    &:hover { color: #fff; }

    ${(props) => props.color == "green" && ` &:hover:not(:disabled) { background: rgba(0, 184, 105, 0.4); } `}
    ${(props) => props.color == "red" && ` &:hover:not(:disabled) { background: rgba(199, 14, 14, 0.4); } `}
    ${(props) => props.color == "secondary" && ` &:hover:not(:disabled) { background: rgba(61, 61, 61, 0.4); } `}

    ${(props) => props.size == "small" && `
        width: fit-content;
        padding: .75rem;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
    `}

    ${(props) => props.size == "large" && `
        padding: 1.25rem;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;
    `}

    ${(props) => props.size == "xlarge" && `
        padding: 1.5rem;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
    `}

    cursor: ${(props) => props.disabled ? "not-allowed; opacity: 0.75;" : "pointer"};
`;

export default Button;