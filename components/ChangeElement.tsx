import Router from "next/router";
import styled from "styled-components";
import Element from "./Element";

interface Props {
    title: string;
    color: string;
    link: string;
    icon: string;
}

const ChangeElement = ({ title, color, link, icon }: Props) => {
    return (
        <Element color={color} link={link}>
            <span className="font-bold text-xl">{title}</span>
            <div className="mt-16 mb-16">
                <img src={icon} width={360} />
            </div>
        </Element>
    )
}

export default ChangeElement;