import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AppStore = {
    currentCityIndex: number;
    cities: CityData[];

    setCurrentCityIndex: (index: number) => void;

    addCity: (city: CityData) => void;
    removeCity: (id: number) => void;
};

export interface CityData {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

export const useAppStore = create<AppStore>()(
    persist(
        immer((set, get) => ({
            currentCityIndex: 0,
            cities: [],

            setCurrentCityIndex: (index: number) => {
                set({ currentCityIndex: index });
            },

            addCity: (city: CityData) => {
                set({
                    cities: get().cities.concat(city),
                });
            },
            removeCity: (id) => {
                set((state: AppStore) => {
                    const cityIndex = state.cities.findIndex((city) => city.id === id);
                    state.cities.splice(cityIndex, 1);
                    state.currentCityIndex = 0; //Math.min(state.currentCityIndex, state.cities.length - 1);
                    console.log(state.currentCityIndex);
                });
            },
        })),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
