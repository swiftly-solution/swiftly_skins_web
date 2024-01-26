import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { v4 } from "uuid";

export const PaginationBox = styled.div`
    padding: 0;

    margin-left: auto;
    margin-right: .5rem;
    margin-top: 1rem;

    display: flex;
    flex-direction: row;

    color: #3d3d3d;
    cursor: pointer;

    background: #161616;
    border: 1px solid #3d3d3d;

    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;

    border-radius: 12px;

    width: min-content;

    & > div {
        transition: 0.2s ease-in-out;
        border-right: 1px solid #3d3d3d;
        padding: .75rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    & > div.current { color: #fff; }
    & > div.current > svg path { fill: #fff; }
    & > div:hover { color: #fff; }
    & > div:hover > svg path { fill: #fff; }

    & > div:last-of-type { border-right: 0; }
`;

interface Props {
    pages: number[];
    firstPage: boolean;
    lastPage: boolean;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
}

export default function Pagination({ pages, page, firstPage, lastPage, setPage }: Props) {
    if (pages.length == 1) return (<></>);
    return (
        <PaginationBox className="select-none">
            {!firstPage && <div key={v4()} onClick={() => setPage((last) => last - 1)} style={{ width: "3rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.0001 21V3.00004C18.9995 2.81779 18.9493 2.63916 18.8547 2.48336C18.7602 2.32756 18.6249 2.20049 18.4636 2.11584C18.3022 2.03119 18.1207 1.99215 17.9388 2.00293C17.7569 2.01372 17.5814 2.07391 17.4311 2.17704L4.43111 11.177C3.89211 11.55 3.89211 12.448 4.43111 12.822L17.4311 21.822C17.581 21.9262 17.7567 21.9873 17.9389 21.9987C18.1211 22.01 18.303 21.9713 18.4647 21.8865C18.6264 21.8018 18.7619 21.6744 18.8563 21.5181C18.9506 21.3618 19.0004 21.1826 19.0001 21Z" fill="#3D3D3D" />
                </svg>
            </div>}
            {pages.map((pg) => (
                <div key={pg} onClick={() => setPage(pg)} className={pg == page ? "current" : ""} style={{ width: "3rem" }}>
                    {pg}
                </div>
            ))}
            {!lastPage && <div key={v4()} onClick={() => setPage((last) => last + 1)} style={{ width: "3rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.99989 2.99996L4.99989 21C5.00046 21.1822 5.05073 21.3608 5.14527 21.5166C5.23981 21.6724 5.37506 21.7995 5.53645 21.8842C5.69783 21.9688 5.87925 22.0078 6.06118 21.9971C6.2431 21.9863 6.41864 21.9261 6.56889 21.823L19.5689 12.823C20.1079 12.45 20.1079 11.552 19.5689 11.178L6.56889 2.17796C6.41895 2.07379 6.24332 2.0127 6.0611 2.00133C5.87887 1.98996 5.69702 2.02875 5.53529 2.11348C5.37356 2.19821 5.23814 2.32564 5.14375 2.48193C5.04936 2.63822 4.99961 2.81738 4.99989 2.99996Z" fill="#3D3D3D" />
                </svg>
            </div>}
        </PaginationBox>
    )
}
