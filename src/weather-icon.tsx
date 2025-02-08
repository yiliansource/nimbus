import { weatherCodeToKey } from "./weathercodes";

export function WeatherIcon({ code }: { code: number }) {
    return (
        <img
            className="block w-full h-full"
            src={`/weathericons/${weatherCodeToKey(code, new Date().getHours() >= 20)}.png`}
        />
    );
}
