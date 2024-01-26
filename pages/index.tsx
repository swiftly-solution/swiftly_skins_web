import ChangeElement from "@/components/ChangeElement";
import GridOrBlockView from "@/components/GridOrBlockView";
import NotLoggedIn from "@/components/NotLoggedIn";
import PageContentBlock from "@/components/PageContentBlock";
import ExecuteRequest from "@/modules/http/ExecuteRequest";
import t from "@/modules/translation/t";
import { useSession } from "next-auth/react";
import Router from "next/router";

export default function Home() {
	const session = useSession();
	const { response, finished, error } = ExecuteRequest<boolean>("/api/panelsetup/fetchfinished", "get");
	if (finished == true && response == false) Router.push("/setup");

	return (
		<PageContentBlock title={t("home.title")} loading={session.status == 'loading' || finished == false || (finished == true && response == false)}>
			{error.length > 0 ? error : (session.status == 'unauthenticated' ? <NotLoggedIn /> : <>
				<GridOrBlockView gridtype={"column"} gridnumber={4} gapbetween={24} tocenter>
					<ChangeElement link={"/skins"} title={t("home.change_skin")} color={"#eb4b4b"} icon={"/images/skins/weapon_bayonet_am_emerald_marbleized_light.png"} />
					<ChangeElement link={"/agents"} title={t("home.change_agent")} color={"#d32ce6"} icon={"/images/agents/agent-4619.png"} />
					<ChangeElement link={"/graffiti"} title={t("home.change_graffiti")} color={"#8847ff"} icon={"/images/graffiti/graffiti-1664.png"} />
					<ChangeElement link={"/musickit"} title={t("home.change_musickit")} color={"#4b69ff"} icon={"/images/musickits/music_kit-16_st.png"} />
				</GridOrBlockView>
			</>)}
		</PageContentBlock>
	);
}
