import { fetchWeatherApi } from "openmeteo";
import useSWR from "swr";

import { LocationData } from "./store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = async (params: any) => {
    console.log("fetch!");
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    // const timezone = response.timezone();
    // const timezoneAbbreviation = response.timezoneAbbreviation();
    // const latitude = response.latitude();
    // const longitude = response.longitude();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const openMeteoTimeToTimestamp = (value: number) => (value + utcOffsetSeconds) * 1000;

    const dailyTemperaturesMin = daily.variables(0)!.valuesArray()!;
    const dailyTemperaturesMax = daily.variables(1)!.valuesArray()!;
    const dailyWeatherCodes = daily.variables(2)!.valuesArray()!;
    const dailyData = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval())
        .map(openMeteoTimeToTimestamp)
        .map((timestamp, i) => ({
            time: timestamp,
            temperatureMin: dailyTemperaturesMin[i],
            temperatureMax: dailyTemperaturesMax[i],
            dailyWeatherCodes: dailyWeatherCodes[i],
        }));

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        current: {
            time: openMeteoTimeToTimestamp(Number(current.time())),
            temperature: current.variables(0)!.value(),
            weatherCode: current.variables(1)!.value(),
        },
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                openMeteoTimeToTimestamp,
            ),
        },
        daily: dailyData,
    };

    return weatherData;
};

export const useOpenMeteo = (location: LocationData) => {
    const key = location
        ? {
              latitude: location.latitude.toString(),
              longitude: location.longitude.toString(),
              temperature_unit: "celsius",
              wind_speed_unit: "ms",
              current: ["temperature_2m", "weather_code"].join(","),
              hourly: [].join(","),
              daily: ["temperature_2m_min", "temperature_2m_max", "weather_code"].join(","),
          }
        : null;

    return useSWR(key, fetcher, {
        refreshInterval: 1000 * 60,
        refreshWhenHidden: true,
        refreshWhenOffline: false,
    });
};
