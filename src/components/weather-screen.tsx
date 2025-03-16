import clsx from "clsx";
import { useAtomValue } from "jotai";
import moment from "moment";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

import { useDrag } from "../hooks/use-drag";
import { useOpenMeteo } from "../open-meteo";
import { selectedLocationAtom } from "../store";
import { weatherCodeToLabel } from "../weathercodes";
import { Background } from "./background";

function roundTimestampToHalfHour(timestamp: number) {
    const ratio = 1000 * 60 * 30;
    return Math.round(timestamp / ratio) * ratio;
}

export function WeatherScreen() {
    // const [selectedLocationIndex, setSelectedLocationIndex] = useAtom(selectedLocationIndexAtom);
    // const [locations, setLocations] = useAtom(locationsAtom);
    const selectedLocationData = useAtomValue(selectedLocationAtom);

    const divRef = useRef<HTMLDivElement>(null);

    const [hoursOffset, setHoursOffset] = useState(0);

    const handleDrag = (e: PointerEvent) => {
        const newOffset = Math.max(0, Math.min(24, hoursOffset + e.movementX * 0.03));
        setHoursOffset(newOffset);
    };

    useDrag(divRef, [hoursOffset], {
        onDrag: handleDrag,
    });

    const { data } = useOpenMeteo(selectedLocationData);
    // const { data } = useOpenMeteo(selectedLocationData.latitude, selectedLocationData.longitude);

    const currentHourlyData = data?.hourly[Math.floor(hoursOffset)];
    const dailyWeatherData = data?.daily[-moment().diff(moment().add(hoursOffset, "h"), "days")]; // not sure if this works correctly

    return (
        <div
            className={clsx(
                "relative w-full",
                "sm:w-[360px] sm:m-auto sm:h-[680px] sm:rounded-2xl sm:overflow-scroll no-scrollbar sm:drop-shadow-lg",
            )}
            ref={divRef}
        >
            <div className="relative w-full min-h-screen h-full sm:min-h-auto">
                {/* <LocationSelectionScreen /> */}

                <div className="absolute top-0 left-1/2 -translate-x-1/2 py-8 flex flex-col items-center drop-shadow">
                    <div className="mb-1 flex flex-row items-center gap-2 text-2xl font-bold uppercase">
                        <span className="text-lg opacity-75">
                            <FaMapMarkerAlt />
                        </span>
                        <span>{selectedLocationData.name}</span>
                    </div>
                    <CurrentDateTimeWidget
                        offset={roundTimestampToHalfHour(hoursOffset * 60 * 60 * 1000)}
                        handleResetOffset={() => setHoursOffset(0)}
                    />
                </div>

                <div className={clsx("sm:pt-[490px]!")} style={{ paddingTop: getWeatherOffsetYStyle() }}>
                    <div className="flex flex-row items-center justify-center py-8 gap-8 drop-shadow">
                        <div className={clsx("font-thin tracking-[-2px]", "text-8xl")}>
                            {currentHourlyData
                                ? currentHourlyData.temperature.toFixed(
                                      Math.abs(data.current.temperature) >= 10 ? 0 : 1,
                                  )
                                : "?"}
                            °
                        </div>
                        <div className="flex flex-col items-center">
                            {/* <span className="text-5xl">
                                <div className="h-20 aspect-square">
                                    {data && <WeatherIcon code={data.current.weatherCode} />}
                                </div>
                            </span> */}
                            <p
                                className={clsx(
                                    "font-semibold text-center",
                                    currentHourlyData && weatherCodeToLabel(currentHourlyData.weatherCode).length >= 8
                                        ? "text-base"
                                        : "text-xl",
                                )}
                            >
                                {currentHourlyData ? weatherCodeToLabel(currentHourlyData.weatherCode) : "?"}
                            </p>
                            <p className="text-sm flex flex-row gap-1 opacity-75">
                                <span>L: {dailyWeatherData?.temperatureMin.toFixed(0) ?? "?"}°</span>
                                <span>&bull;</span>
                                <span>H: {dailyWeatherData?.temperatureMax.toFixed(0) ?? "?"}°</span>
                            </p>
                        </div>
                    </div>
                    {/* <div className="h-40"></div> */}
                </div>

                <Background timeOffset={roundTimestampToHalfHour(hoursOffset * 60 * 60 * 1000)} />
            </div>
        </div>
    );
}

function CurrentDateTimeWidget({
    offset = 0,
    inactive = false,
    handleResetOffset,
}: {
    offset: number;
    inactive?: boolean;
    handleResetOffset?: () => void;
}) {
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

    const offsetTime = time.clone().add(offset);

    return (
        <div>
            <span className={clsx("text-sm", inactive && "line-through")}>{offsetTime.format("dddd, MMMM Do")}</span>
            <div className="flex flex-row justify-center gap-4 text-center">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key="original"
                        className={clsx("text-sm tracking-wider w-12", offset != 0 && "line-through cursor-pointer")}
                        animate={{ opacity: offset != 0 ? 0.5 : 1 }}
                        layout
                        onClick={() => void (offset != 0 && handleResetOffset?.())}
                    >
                        {time.hour().toString().padStart(2, "0")}
                        {offset != 0 || hasColon ? ":" : " "}
                        {time.minute().toString().padStart(2, "0")}
                    </motion.span>

                    {offset != 0 && (
                        <motion.span
                            key="offset"
                            className="text-sm tracking-wider w-12"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            {offsetTime.hour().toString().padStart(2, "0")}
                            {hasColon ? ":" : " "}
                            {offsetTime.minute().toString().padStart(2, "0")}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function getWeatherOffsetYStyle() {
    const x1 = 640,
        y1 = 900,
        x2 = 360,
        y2 = 520;

    const a = (y1 - y2) / (x1 - x2);
    const b = (x1 * y2 - x2 * y1) / (x1 - x2);

    return `calc(100vw * ${a} + ${b}px)`;
}
