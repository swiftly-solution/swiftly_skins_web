import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import Button from "./Button";
import Label from "./Label";
import { ProcessNotification, ToastError, ToastSuccess } from "@/modules/notifications/toasts";
import { sendPostRequest } from "@/modules/http/http";

interface Props {
    data: any[];
    userData: string[];
    updateCB: Dispatch<SetStateAction<number>>;
}

const Pagination = dynamic(import("@/components/Pagination").then((mod) => mod.default));
const Modal = dynamic(import("react-responsive-modal").then((mod) => mod.Modal));
const PaginationBox = dynamic(import("@/components/Pagination").then((mod) => mod.PaginationBox));

const GeneratePageData = (values: any[], page: number, itemsPerPage: number) => {
    const itemsImpart = values.length / itemsPerPage;

    return { outData: values.slice(itemsPerPage * (page - 1), itemsPerPage * page), totalPages: itemsImpart > Math.floor(itemsImpart) ? Math.floor(itemsImpart) + 1 : Math.floor(itemsImpart) };
}

const CaculateNameByWear = (wear: number) => {
    if (wear < 0.07) return t("factory_new");
    else if (wear < 0.15) return t("minimal_wear");
    else if (wear < 0.38) return t("field_tested");
    else if (wear < 0.45) return t("well_worn");
    else return t("battle_scared");
}

const SelectPage = ({ data, userData, updateCB }: Props) => {
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

    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(undefined);
    const [seed, setSeed] = useState<number>(1000);
    const [wear, setWear] = useState<number>(0.0);
    const [nameTag, setNameTag] = useState<string>("");

    const [submitting, setSubmitting] = useState(false);

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
        <>
            <Modal open={showModal} styles={{ closeIcon: { fill: "#fff" }, modal: { background: "#1C1C1C", borderRadius: "1rem", padding: "4rem 6rem 1.5rem 6rem" } }}
                onClose={() => { setShowModal(false); setSeed(1000); setWear(0.0); setNameTag(""); setSelectedData(undefined) }} center closeOnEsc={true} closeOnOverlayClick={true}>
                {selectedData == undefined ? <HashLoader size={96} color={"#afafaf"} className="m-auto" /> : <>
                    <div className="w-[320px] flex flex-col gap-2 font-semibold items-center content-center text-center">
                        <Image src={selectedData.image} alt={selectedData.image} width={144} height={144} />
                        <div className="mt-4">{t("grade")}: <span className="ml-2" style={{ color: selectedData.color }}>{selectedData.rarity}</span></div>
                        {!selectedData.team ? <></> : <div>{t("team")}: <span className="ml-2" style={{ color: (selectedData.team == "t" ? "#c26334" : "#3d74b8") }}>{t(selectedData.team)}</span></div>}

                        {(selectedData.id.startsWith("skin-") && !userData.includes(selectedData.id)) ? <>
                            <Label>{t("nametag")}</Label>
                            <Input disabled={submitting} type={"text"} onChange={(e) => setNameTag(e.target.value)} defaultValue={selectedData.name} placeholder={selectedData.name} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />

                            <Label>{t("seed")} ({seed})</Label>
                            <Input disabled={submitting} type={"number"} min={1000} max={999999999} value={seed} onChange={(e) => {
                                const seedVal = Number(e.target.value);
                                if (seedVal > 999999999) setSeed(999999999);
                                else if (seedVal < 1000) setSeed(1000);
                                else setSeed(Number(e.target.value))
                            }} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />

                            <Label>{t("wear")} ({wear} - {CaculateNameByWear(wear)})</Label>
                            <Input disabled={submitting} type={"number"} min={0.0} max={1.0} value={wear} onChange={(e) => {
                                const wearVal = Number(e.target.value);
                                if (wearVal >= 1.0) setWear(1.0);
                                else if (wearVal <= 0.0) setWear(0.0);
                                else setWear(Number(e.target.value))
                            }} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />
                            <PaginationBox style={{ marginLeft: "initial" }}>
                                <div onClick={() => { if (submitting) return; setWear(0.45) }}>
                                    {t("battle_scared")}
                                </div>
                                <div onClick={() => { if (submitting) return; setWear(0.38) }}>
                                    {t("well_worn")}
                                </div>
                                <div onClick={() => { if (submitting) return; setWear(0.15) }}>
                                    {t("field_tested")}
                                </div>
                                <div onClick={() => { if (submitting) return; setWear(0.07) }}>
                                    {t("minimal_wear")}
                                </div>
                                <div onClick={() => { if (submitting) return; setWear(0) }}>
                                    {t("factory_new")}
                                </div>
                            </PaginationBox>
                        </> : <></>}

                        <Button disabled={submitting} className="mt-6" size={"large"} color={!userData.includes(selectedData.id) ? "green" : "red"} onClick={() => {
                            if (submitting) return;

                            if (seed < 1000 || seed > 999999999) return ProcessNotification({ main: "errors.is_number_between", replace: { "{field}": "seed", "{min}": "1000", "{max}": "999999999" } }, ToastError);
                            if (wear < 0.0 || wear > 1.0) return ProcessNotification({ main: "errors.is_number_between", replace: { "{field}": "float", "{min}": "0.0", "{max}": "1.0" } }, ToastError);
                            if (!nameTag.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "nametag" } }, ToastError);

                            setSubmitting(true);

                            setTimeout(async () => {
                                try {
                                    await sendPostRequest("/api/user/toggleskinstatus", { id: selectedData.id, nameTag, seed, wear }, (response) => {
                                        ProcessNotification(response.message, ToastSuccess);
                                        updateCB(Date.now());
                                        setSubmitting(false);
                                        setShowModal(false);
                                    }, (response) => {
                                        ProcessNotification(response.message, ToastError);
                                        setSubmitting(false);
                                    });
                                } catch (err) {
                                    console.error(err)
                                    ToastError(t("errors.system_error"));
                                    setSubmitting(false);
                                }
                            }, 500);
                        }}>{t(userData.includes(selectedData.id) ? "unequip" : "equip")}</Button>
                    </div>
                </>}
            </Modal>
            <FlexOrBlockView className="w-full" direction={"row"}>
                <div className="mr-4 flex flex-col gap-4 overflow-y-scroll h-[52rem]">
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
                        {showData.map((value, index) => (
                            <Element key={value.id} onClick={() => { setSelectedData(value); setNameTag(value.name); setShowModal(true); }} className={`${userData.includes(value.id) ? "active" : ""}`} color={value.color}>
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
        </>
    )
}

export default SelectPage;