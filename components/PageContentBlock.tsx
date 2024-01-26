import { useEffect } from "react";
import styled from "styled-components";
import Header from "./Header";
import Head from "next/head";
import FetchSetting from "@/modules/settings/FetchSetting";
import BounceLoader from "react-spinners/BounceLoader"
import dynamic from "next/dynamic";

export interface PageContentBlockProps {
    title: string;
    height?: string;
    loading?: boolean;
    children: React.ReactNode;
}

const FlexOrBlock = styled.div`
    display: flex;

    @media (orientation: portrait) {
        display: block;
        width: 100%;
    }
`;

const Toaster = dynamic(import("react-hot-toast").then((mod) => mod.Toaster));

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, height, loading, children }) => {

    const ttl = `${title} | ${FetchSetting("title")}`

    return (
        <main>
            <Head>
                <title>{ttl}</title>
            </Head>
            <Header />
            <FlexOrBlock style={{ height: height || "unset" }}>
                {loading ? <div className="absolute flex items-center content-center w-full">
                    <BounceLoader size={60} color={"#afafaf"} className="m-auto" />
                </div> : children}
            </FlexOrBlock>
            <Toaster position={'bottom-right'} reverseOrder={true} toastOptions={{ duration: 2500 }} />
        </main>
    )
}

export default PageContentBlock;