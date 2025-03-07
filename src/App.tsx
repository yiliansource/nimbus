import { useDrag } from "@use-gesture/react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaCloud } from "react-icons/fa";

import { AddCityScreen } from "./add-city-screen";
import { CitylistScreen } from "./city-list.screen";
import { OpenMeteoWeatherResult } from "./open-meteo";
import { useAppStore } from "./store";
import { WeatherDashboard } from "./weather-dashboard";

function App() {
    const currentCityIndex = useAppStore((state) => state.currentCityIndex);
    const setCurrentCityIndex = useAppStore((state) => state.setCurrentCityIndex);

    const cities = useAppStore((state) => state.cities);

    const [citylistOpen, setCitylistOpen] = useState(false);

    const currentCityData = cities[currentCityIndex];

    const [weatherApiLoading, setWeatherApiLoading] = useState(false);
    const [weatherApiResponse, setWeatherApiResponse] = useState<OpenMeteoWeatherResult | null>(null);

    const bind = useDrag(({ down, movement: [mx] }) => {
        if (!down && Math.abs(mx) > 50) {
            const d = Math.sign(mx);
            setCurrentCityIndex(currentCityIndex - d);
        }
    });

    useEffect(() => {
        if (!currentCityData) {
            setWeatherApiLoading(false);
            setWeatherApiResponse(null);
            return;
        }

        const baseUrl = "https://api.open-meteo.com/v1/forecast";
        const query = new URLSearchParams({
            latitude: currentCityData.latitude.toString(),
            longitude: currentCityData.longitude.toString(),
            temperature_unit: "celsius",
            wind_speed_unit: "ms",
            current: ["temperature_2m", "weather_code", "wind_speed_10m", "relative_humidity_2m", "rain"].join(","),
            hourly: ["temperature_2m", "weather_code", "precipitation"].join(","),
            daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"].join(","),
        });

        setWeatherApiLoading(true);

        fetch(baseUrl + "?" + query)
            .then((res) => res.json())
            .then((res: OpenMeteoWeatherResult) => {
                setWeatherApiResponse(res);
                setWeatherApiLoading(false);
            });
    }, [currentCityData]);

    return (
        <>
            <main className="relative p-5 min-h-screen bg-zinc-900 text-zinc-100 select-none touch-none" {...bind()}>
                <AnimatePresence>
                    {cities.length === 0 && !citylistOpen && <AddCityScreen canClose={false} />}
                </AnimatePresence>

                <AnimatePresence>
                    {citylistOpen && <CitylistScreen onClose={() => setCitylistOpen(false)} />}
                </AnimatePresence>

                <div className="mb-2 flex flex-row justify-between items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCityData?.id ?? "null"}
                            onClick={() => setCitylistOpen(true)}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <p className="font-bold text-xl">{currentCityData?.name ?? "?"}</p>
                            <p className="text-sm text-zinc-400">{format(new Date(), "cccc, do LLLL")}</p>
                        </motion.div>
                    </AnimatePresence>
                    <div>
                        {/* <motion.div
                            className="bg-zinc-800 text-zinc-400 p-2 rounded-lg"
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <FaCog />
                        </motion.div> */}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {weatherApiLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="flex my-16 opacity-25">
                                <div className="m-auto text-4xl animate-pulse">
                                    <FaCloud />
                                </div>
                            </div>
                        </motion.div>
                    ) : weatherApiResponse ? (
                        <motion.div
                            key={currentCityData.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <WeatherDashboard data={weatherApiResponse!} />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </main>
        </>
    );
}

export default App;
