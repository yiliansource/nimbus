import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AppStore = {
    currentCityIndex: number;
    cities: CityData[];

    setCurrentCityIndex: (index: number) => void;

    setCities: (cities: CityData[]) => void;
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
        immer((set) => ({
            currentCityIndex: 0,
            cities: [],

            setCurrentCityIndex: (index: number) => {
                set((state: AppStore) => {
                    state.currentCityIndex = Math.max(0, Math.min(index, state.cities.length - 1));
                });
            },

            setCities(cities) {
                set((state: AppStore) => {
                    const selectedCityId = state.cities[state.currentCityIndex].id;
                    state.cities = cities;
                    state.currentCityIndex = state.cities.findIndex((c) => c.id === selectedCityId);
                });
            },
            addCity: (city) => {
                set((state: AppStore) => {
                    if (state.cities.some((c) => c.id === city.id)) return;

                    state.cities.push(city);
                    state.currentCityIndex = Math.max(state.currentCityIndex, 0);
                });
            },
            removeCity: (id) => {
                set((state: AppStore) => {
                    const cityIndex = state.cities.findIndex((city) => city.id === id);
                    if (cityIndex >= 0) {
                        state.cities.splice(cityIndex, 1);
                        state.currentCityIndex = Math.min(state.currentCityIndex, state.cities.length - 1);
                    }
                });
            },
        })),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
