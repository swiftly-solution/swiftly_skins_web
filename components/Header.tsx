import styled from "styled-components"
import Button from "./Button"
import { signIn, signOut, useSession } from "next-auth/react"
import FetchSetting from "@/modules/settings/FetchSetting"
import t from "@/modules/translation/t"
import { PROVIDER_ID } from "next-auth-steam"
import Router, { useRouter } from "next/router"

const Head = styled.div`
    background: #161616;
    border: 1px solid #3D3D3D;
    border-radius: 12px;
    width: 100%;
    padding: 24px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;

    & img {
        margin-top: 4px;
        border-radius: 8px;
    }
`;

const Header = () => {
    const session = useSession();

    const path = useRouter().asPath;

    return (
        <Head>
            <div className="text-2xl font-semibold cursor-pointer select-none" onClick={() => Router.push("/")}>
                {FetchSetting("title")}
            </div>
            <div className="ml-auto flex items-center gap-4">
                {path.includes("/setup") ? <></> : <>
                    {session.status == 'authenticated' ? <a href={`/profile`}>
                        <div className="flex items-center gap-4 cursor-pointer">
                            <img src={String(session.data?.user?.image)} width={48} alt={""} />
                            <div className="block">
                                <div className="font-medium">{session.data?.user?.name}</div>
                                {/* @ts-expect-error */}
                                <div className="font-normal text-gray-500">{session.data?.user?.steam.steamid}</div>
                            </div>
                        </div>
                    </a> : <></>}
                    <Button color={"secondary"} size={"small"} disabled={session.status === 'loading'} onClick={() => {
                        if (session.status === 'loading') return;
                        if (session.status === 'authenticated') signOut();
                        else signIn(PROVIDER_ID);
                    }}>{t(session.status === 'authenticated' ? "logout" : "login")}</Button>
                </>}
            </div>
        </Head>
    )
}

export default Header;