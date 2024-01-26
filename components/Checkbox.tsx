import { ForwardRefRenderFunction, ReactNode } from "react";
import styled from "styled-components";

interface Props {
    checked?: boolean;
    children: ReactNode;
    className?: string;
    onClick?: () => undefined;
    style?: Record<string, any>;
}

const CustomInput = styled.input`
    resize: none;
    appearance: none;
    align-items: middle;
    color-adjust: exact;
    background-origin: border-box;
    background: #1C1C1C;
    border: 1px solid #3D3D3D;
    border-radius: 50%;
    padding: 8px;
    transition: 0.2s ease-in-out;

    &:checked {
        background: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: #3D3D3D;
        background-size: 100% 100%;
        border-color: transparent;
        background-position: center;
    }
`;

const DivCheckbox = styled.div`
    & * {
        transition: 0.2s ease-in-out;
    }
`;

const Checkbox: ForwardRefRenderFunction<HTMLDivElement, Props> = ({ style, checked, children, className, onClick }) => {
    return (
        <DivCheckbox className={`${className} cursor-pointer justify-center items-center align-middle w-full rounded-lg p-4 transition duration-200 select-none`} style={style || {}} onClick={onClick}>
            <CustomInput readOnly className="align-middle mr-2" type={"checkbox"} checked={checked} />
            {children}
        </DivCheckbox>
    )
}

export default Checkbox;