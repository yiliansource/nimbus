import clsx from "clsx";
import { useAtomValue } from "jotai";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

import { useOpenMeteo } from "../open-meteo";
import { selectedLocationAtom } from "../store";
import { WeatherIcon } from "../weather-icon";
import { weatherCodeToLabel } from "../weathercodes";
import { Background } from "./background";

export function WeatherScreen() {
    // const [selectedLocationIndex, setSelectedLocationIndex] = useAtom(selectedLocationIndexAtom);
    // const [locations, setLocations] = useAtom(locationsAtom);
    const selectedLocationData = useAtomValue(selectedLocationAtom);

    const { data } = useOpenMeteo(selectedLocationData);

    return (
        <div
            className={clsx(
                "relative w-full",
                "sm:w-[360px] sm:m-auto sm:h-[680px] sm:rounded-2xl sm:overflow-scroll no-scrollbar sm:drop-shadow-lg",
            )}
        >
            <div className="relative w-full min-h-screen sm:min-h-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 py-8 flex flex-col items-center drop-shadow">
                    <div className="mb-1 flex flex-row items-center gap-2 text-2xl font-bold uppercase">
                        <span className="text-lg opacity-75">
                            <FaMapMarkerAlt />
                        </span>
                        <span>{selectedLocationData.name}</span>
                    </div>
                    <CurrentDateTimeWidget />
                </div>

                <div className={clsx("sm:pt-[490px]!")} style={{ paddingTop: getWeatherOffsetYStyle() }}>
                    <div className="flex flex-row items-center justify-center py-8 gap-4 drop-shadow">
                        <div className="text-9xl font-thin tracking-[-8px]">
                            {data?.current.temperature.toFixed(1) ?? "?"}°
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-5xl">
                                <div className="h-20 aspect-square">
                                    {data && <WeatherIcon code={data.current.weatherCode} />}
                                </div>
                            </span>
                            <p className="font-semibold text-xl">
                                {data ? weatherCodeToLabel(data.current.weatherCode) : "?"}
                            </p>
                            <p className="text-sm flex flex-row gap-1 opacity-75">
                                <span>L: {data?.daily[0].temperatureMin.toFixed(0) ?? "?"}°</span>
                                <span>&bull;</span>
                                <span>H: {data?.daily[0].temperatureMax.toFixed(0) ?? "?"}°</span>
                            </p>
                        </div>
                    </div>
                    {/* <div className="h-40"></div> */}
                </div>

                <Background />
            </div>
        </div>
    );
}

function CurrentDateTimeWidget() {
    const [time, setTime] = useState(moment());
    const [hasColon, setHasColon] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment());
            setHasColon((v) => !v);
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return (
        <>
            <span className="text-sm">{time.format("dddd, MMMM Do")}</span>
            <span className="text-sm tracking-wider">
                {time.hour().toString().padStart(2, "0")}
                {hasColon ? ":" : " "}
                {time.minute().toString().padStart(2, "0")}
            </span>
        </>
    );
}

function getWeatherOffsetYStyle() {
    const x1 = 640,
        y1 = 900,
        x2 = 360,
        y2 = 500;

    const a = (y1 - y2) / (x1 - x2);
    const b = (x1 * y2 - x2 * y1) / (x1 - x2);

    return `calc(100vw * ${a} + ${b}px)`;
}
