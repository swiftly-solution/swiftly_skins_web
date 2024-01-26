import { Graffiti } from "../types/Graffiti";
import FetchGraffiti from "./FetchGraffiti";

export default (query: string): Graffiti | undefined => {
    const graffities = FetchGraffiti();

    const graffiti = graffities.filter((val) => val.id == query);

    return (graffiti.length > 0 ? graffiti[0] : undefined);
}