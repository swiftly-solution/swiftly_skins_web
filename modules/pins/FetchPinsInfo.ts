import { Pins } from "../types/Pins";
import FetchPins from "./FetchPins";

export default (query: string): Pins | undefined => {
    const pins = FetchPins();

    const pin = pins.filter((val) => val.id == query);

    return (pin.length > 0 ? pin[0] : undefined);
}