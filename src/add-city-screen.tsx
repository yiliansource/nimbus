import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";

import { OpenMeteoLocationResult } from "./open-meteo";
import { useAppStore } from "./store";
import { debounce } from "./util";

export function AddCityScreen({ canClose, onClose }: { canClose: boolean; onClose?: () => void }) {
    const [citylistInput, setCitylistInput] = useState("");

    const [citylistResponse, setCitylistResponse] = useState<OpenMeteoLocationResult[]>([]);
    const [citylistLoading, setCitylistLoading] = useState(false);

    const addCity = useAppStore((state) => state.addCity);

    const queryCityDebounced = useMemo(
        () =>
            debounce((s: string) => {
                const query = new URLSearchParams({
                    name: s,
                });
                const baseUrl = "https://geocoding-api.open-meteo.com/v1/search";
                fetch(baseUrl + "?" + query)
                    .then((res) => res.json())
                    .then(({ results }: { results?: OpenMeteoLocationResult[] }) => {
                        setCitylistResponse(results ?? []);
                        setCitylistLoading(false);
                    });
            }, 500),
        [],
    );

    const handleAddCity = (city: OpenMeteoLocationResult) => {
        addCity({
            id: city.id,
            name: city.name,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude,
        });
        onClose?.();
    };

    useEffect(() => {
        if (!citylistInput) return;

        setCitylistLoading(true);
        queryCityDebounced(citylistInput);
    }, [queryCityDebounced, citylistInput]);

    const handleCitylistInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCitylistInput(e.target.value);
    };

    return (
        <motion.div className="fixed top-0 left-0 w-screen h-screen bg-zinc-900/75 backdrop-blur z-20">
            <div className="p-6 flex flex-col h-full items-center justify-center">
                <div
                    className={clsx("mt-0 mr-0 ml-auto", !canClose && "opacity-0")}
                    onClick={() => canClose && onClose?.()}
                >
                    <FaTimes />
                </div>
                <div className="my-auto">
                    <p className="text-center mb-6">Where would you like to check the weather?</p>
                    <motion.input
                        className="mb-6 py-2 px-3 rounded-md text-center w-full"
                        placeholder="Amsterdam"
                        value={citylistInput}
                        onChange={handleCitylistInput}
                    ></motion.input>
                    {citylistInput.length === 0 ? null : citylistLoading ? (
                        <div className="text-center uppercase text-sm text-zinc-500">loading...</div>
                    ) : citylistResponse.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {citylistResponse.slice(0, 3).map((res) => (
                                <div
                                    key={res.id}
                                    className="flex flex-row items-center gap-3"
                                    onClick={() => handleAddCity(res)}
                                >
                                    <div className="">
                                        <img
                                            className="w-6 h-6"
                                            src={`https://open-meteo.com/images/country-flags/${res.country_code.toLowerCase()}.svg`}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="">{res.name}</p>
                                        <p className="text-xs">{res.country}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center uppercase text-sm text-zinc-500">no results</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
