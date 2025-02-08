export interface OpenMeteoLocationResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_id: number;
    country_code: string;
    timezone: string;
    population: number;
    country: string;
    admin1_id: number;
    admin1: string;
}

export interface OpenMeteoWeatherResult {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: {
        time: string;
        interval: string;
        temperature_2m: string;
        weather_code: string;
        wind_speed_10m: string;
        relative_humidity_2m: string;
        rain: string;
    };
    current: {
        time: string;
        interval: number;
        temperature_2m: number;
        weather_code: number;
        wind_speed_10m: number;
        relative_humidity_2m: number;
        rain: number;
    };
    hourly_units: {
        time: string;
        temperature_2m: string;
        precipitation: string;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        weather_code: number[];
        precipitation: number[];
    };
    daily_units: {
        time: string;
        weather_code: string;
        temperature_2m_max: string;
        temperature_2m_min: string;
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}
