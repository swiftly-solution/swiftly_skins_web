import Router from "next/router";
import { ReactNode } from "react";
import styled from "styled-components";

interface Prop {
    color: string;
}

interface Props {
    color: string;
    children: ReactNode;
    className?: string;
    link?: string;
    onClick?: () => void;
}

const BaseElement = styled.div<Prop>`
    background: transparent;
    transition: 0.2s ease-in-out;
    
    &:hover, &.active {
        ${(props) => `background: linear-gradient(0deg, ${props.color} 0%, transparent 100%);`}
    }
`;


const Element = ({ color, link, onClick, className, children }: Props) => {
    return (
        <BaseElement onClick={() => {
            if (link) Router.push(link);
            else if (onClick) onClick();
        }} color={color} className={`${className || ""} w-full h-min cursor-pointer rounded-3xl text-center ml-auto flex flex-col items-center content-center mr-auto p-2 shadow-lg hover:ring-[1px] ring-[#3D3D3D]`}>
            {children}
        </BaseElement>
    )
}

export default Element;