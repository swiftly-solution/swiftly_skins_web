import { useEffect, useState } from "react";
import GridOrBlockView from "./GridOrBlockView";
import Element from './Element'
import FlexOrBlockView from "./FlexOrBlockView";
import { v4 } from "uuid";
import Input from "./Input";
import t from "@/modules/translation/t";
import Checkbox from "./Checkbox";
import { HashLoader } from "react-spinners";
import Image from "next/image";
import dynamic from "next/dynamic";

interface Props {
    data: any[];
    userData: string[];
}

const Pagination = dynamic(import("@/components/Pagination"));

const GeneratePageData = (values: any[], page: number, itemsPerPage: number) => {
    const itemsImpart = values.length / itemsPerPage;

    return { outData: values.slice(itemsPerPage * (page - 1), itemsPerPage * page), totalPages: itemsImpart > Math.floor(itemsImpart) ? Math.floor(itemsImpart) + 1 : Math.floor(itemsImpart) };
}

const SelectPage = ({ data, userData }: Props) => {
    const [text, setText] = useState<string>("");
    const [imagesList, setImagesList] = useState<string[]>([]);

    const [grades, setGrades] = useState<{ rarity: string; color: string; }[]>([]);
    const [checkedRarity, setCheckedRarity] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const [checkedTeams, setCheckedTeams] = useState<string[]>([]);

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState<number[]>([1]);
    const [showData, setShowData] = useState<any[]>([]);
    const [firstPage, setFirstPage] = useState(true);
    const [lastPage, setLastPage] = useState(false);

    const [toSearchData, setToSearchData] = useState<any[]>(data);

    useEffect(() => {
        const newGrades: { rarity: string; color: string; }[] = [];
        const newTeams: string[] = [];
        for (const value of data) {
            if (!newGrades.filter((val) => val.rarity == value.rarity).length) newGrades.push({ rarity: value.rarity, color: value.color })
            if (!newTeams.filter((val) => val == value.team).length && value.team != "both") newTeams.push(value.team);
        }
        setGrades(newGrades.sort((a, b) => a.rarity.length - b.rarity.length));
        setTeams(newTeams.sort((a, b) => a.length - b.length));
    }, [data]);

    useEffect(() => {
        const { outData, totalPages } = GeneratePageData(toSearchData, page, 18);
        setShowData(outData);

        const start = Math.max(page - 2, 1);
        const end = Math.min(totalPages, page + 5);

        const pgs = [];
        for (let i = start; i <= end; i++) pgs.push(i);
        setPages(pgs);

        setFirstPage(page == 1);
        setLastPage(page >= totalPages);
    }, [toSearchData, page]);

    useEffect(() => {
        setPage(1);
        setToSearchData(data.filter((val) => val.name.toLowerCase().includes(text.toLowerCase()) || val.id.toLowerCase().includes(text.toLowerCase())).filter((val) => checkedRarity.length > 0 ? checkedRarity.includes(val.rarity) : true).filter((val) => {
            if (val.team == "both") return true;
            return checkedTeams.length >= 1 ? checkedTeams.includes(val.team) : true;
        }));
    }, [data, text, checkedRarity, checkedTeams]);

    return (
        <FlexOrBlockView className="w-full" direction={"row"}>
            <div className="mr-4 flex flex-col gap-4">
                <span className="font-semibold text-md">{t("filters")}</span>
                <Input autoComplete={"on"} style={{ height: "fit-content" }} placeholder={t("search")} onChange={(e) => setText(e.target.value)} type={"text"} />
                {grades.length <= 1 ? <></> : <>
                    <span className="font-semibold text-md">{t("grades")}</span>
                    {grades.map((grade) => <Checkbox key={v4()} onClick={() => {
                        if (checkedRarity.includes(grade.rarity)) setCheckedRarity(checkedRarity.filter((val) => val != grade.rarity));
                        else setCheckedRarity([...checkedRarity, grade.rarity]);
                    }} style={{ background: checkedRarity.includes(grade.rarity) ? grade.color : "#1C1C1C" }} checked={checkedRarity.includes(grade.rarity)}><span style={{ color: checkedRarity.includes(grade.rarity) ? "#fff" : grade.color }}>{grade.rarity}</span></Checkbox>)}
                </>}
                {teams.length <= 1 ? <></> : <>
                    <span className="font-semibold text-md">{t("teams")}</span>
                    {teams.map((team) => <Checkbox key={v4()} onClick={() => {
                        if (checkedTeams.includes(team)) setCheckedTeams(checkedTeams.filter((val) => val != team));
                        else setCheckedTeams([...checkedTeams, team]);
                    }} style={{ background: checkedTeams.includes(team) ? (team == "t" ? "#c26334" : "#3d74b8") : "#1C1C1C" }} checked={checkedTeams.includes(team)}><span style={{ color: checkedTeams.includes(team) ? "#fff" : (team == "t" ? "#c26334" : "#3d74b8") }}>{t(team)}</span></Checkbox>)}
                </>}
            </div>
            <div className="w-full">
                <GridOrBlockView gridtype={"column"} gridnumber={6} gapbetween={8}>
                    {showData.map((value) => (
                        <Element key={value.id} className={`${userData.includes(value.id) ? "active" : ""}`} color={value.color}>
                            <div className="mt-4 mb-4 select-none flex">
                                <Image src={value.image} alt={value.image} hidden={!imagesList.includes(value.image)} priority={true} width={144} height={144} onLoad={(e) => setImagesList((val) => [...val, value.image])} />
                                {!imagesList.includes(value.image) && <HashLoader size={96} color={"#afafaf"} className="m-auto" />}
                            </div>
                            <span className="font-semibold text-md mb-2">{value.name} {userData.includes(value.id) ? `(${t("equipped")})` : ""}</span>
                            <span className="font-normal text-sm mb-2">{t(value.team)}</span>
                        </Element>
                    ))}
                </GridOrBlockView>
                <Pagination pages={pages} firstPage={firstPage} lastPage={lastPage} setPage={setPage} page={page} />
            </div>
        </FlexOrBlockView>
    )
}

export default SelectPage;