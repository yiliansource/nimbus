import { atom } from "jotai";

export const selectedLocationIndexAtom = atom(0);
export const locationsAtom = atom<LocationData[]>([
    {
        id: 38042730985,
        country: "Vienna",
        name: "Vienna",
        latitude: 48.2081,
        longitude: 16.3713,
    },
]);

export interface LocationData {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

export const selectedLocationAtom = atom((get) => {
    return get(locationsAtom)[get(selectedLocationIndexAtom)];
});
