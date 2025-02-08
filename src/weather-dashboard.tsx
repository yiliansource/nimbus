import NumberFlow from "@number-flow/react";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { useState } from "react";
import { FaCloud, FaCloudRain, FaWind } from "react-icons/fa";

import { OpenMeteoWeatherResult } from "./open-meteo";
import { WeatherIcon } from "./weather-icon";

export function WeatherDashboard({ data }: { data: OpenMeteoWeatherResult }) {
    const currentWeatherInfos: {
        icon: React.ReactNode;
        amount: string;
        label: string;
    }[] = [
        {
            icon: <FaWind />,
            amount: data.current.wind_speed_10m.toFixed(1) + " m/s",
            label: "Wind",
        },
        {
            icon: <FaCloudRain />,
            amount: data.current.relative_humidity_2m + "%",
            label: "Humidity",
        },
        {
            icon: <FaCloud />,
            amount: data.current.rain + "%",
            label: "Rain",
        },
    ];

    const [currentForecastOption, setCurrentForecaseOption] = useState(0);
    const forecastOptions = ["Today", "Tomorrow", "Next week"];

    const timeWeatherData: {
        time: Date;
        weather_code: number;
        temperature: number;
    }[] = data.hourly.time
        .map((time, timeIndex) => ({
            time: parseISO(time),
            weather_code: data.hourly.weather_code[timeIndex],
            temperature: data.hourly.temperature_2m[timeIndex],
        }))
        .slice(new Date().getHours(), 30);

    return (
        <>
            <div className="mb-6 flex flex-row justify-between items-center">
                <div className="px-2 flex flex-col items-center">
                    <span className="-mb-3 font-black text-6xl">
                        <NumberFlow value={Math.floor(data.current.temperature_2m * 10) / 10} willChange />
                        <span>°</span>
                    </span>
                    {/* <p className="text-sm text-zinc-300">Thunderstorm</p> */}
                </div>
                <div className="flex flex-col ">
                    <span className="block px-2 text-6xl w-32">
                        <WeatherIcon code={data.current.weather_code} />
                        {/* <FaCloudRain /> */}
                    </span>
                </div>
            </div>
            <div className="p-4 mb-4 flex flex-row justify-between bg-zinc-800 rounded-xl">
                {currentWeatherInfos.map((info) => (
                    <div key={info.label} className="px-4 flex flex-col items-center">
                        <span className="mb-2 text-xl">{info.icon}</span>
                        <p className="text-sm">{info.amount}</p>
                        <p className="text-xs text-zinc-400">{info.label}</p>
                    </div>
                ))}
            </div>
            <div className="mb-4 flex flex-row gap-6">
                {forecastOptions.map((option, optionIndex) => (
                    <div
                        key={option}
                        className={clsx("flex flex-col items-center")}
                        onMouseDown={() => setCurrentForecaseOption(optionIndex)}
                    >
                        <p
                            className={clsx(
                                "mb-1 text-sm transition-colors",
                                optionIndex === currentForecastOption ? "text-zinc-100" : "text-zinc-500",
                            )}
                        >
                            {option}
                        </p>
                        {optionIndex === currentForecastOption && (
                            <motion.span
                                className="block w-1 h-1 rounded-full bg-current text-zinc-100"
                                layoutId="forecastOptionDot"
                            ></motion.span>
                        )}
                    </div>
                ))}
            </div>
            <div className="pb-2 flex flex-row gap-2 overflow-x-scroll">
                {timeWeatherData.map((data) => (
                    <div
                        key={data.time.getTime()}
                        className="flex shrink-0 flex-col py-3 px-5 bg-zinc-800 rounded-xl items-center"
                    >
                        <p className="mb-1 text-xs text-zinc-400">{format(data.time, "kk:mm")}</p>
                        <div className="mb-2 text-lg h-8">
                            <WeatherIcon code={data.weather_code} />
                        </div>
                        <p className="text-sm">{data.temperature.toFixed(0)}°</p>
                    </div>
                ))}
            </div>
        </>
    );
}
