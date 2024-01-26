import { MusicKit } from "../types/MusicKit";
import FetchMusicKits from "./FetchMusicKits";

export default (query: string): MusicKit | undefined => {
    const musickits = FetchMusicKits();

    const musickit = musickits.filter((val) => val.id == query);

    return (musickit.length > 0 ? musickit[0] : undefined);
}