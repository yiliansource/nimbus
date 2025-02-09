export function weatherCodeToKey(code: number, night: boolean = false): string {
    switch (code) {
        case 0:
            return night ? "clear-night" : "clear-day";
        case 1:
            return night ? "clear-night" : "clear-day";
        case 2:
            return night ? "partly-cloudy-night" : "partly-cloudy-day";
        case 3:
            return "cloudy";
        default: // eh
            return "clear-day";
    }
}

export function weatherCodeToLabel(code: number): string {
    switch (code) {
        case 0:
            return "Clear";
        case 1:
            return "Mainly clear";
        case 2:
            return "Partly cloudy";
        case 3:
            return "Overcast";
        case 4:
            return "Foggy";
        case 45:
            return "";
        case 51:
            return "Light drizzle";
        case 53:
            return "Moderate drizzle";
        case 55:
            return "Intense drizzle";
        case 56:
            return "Light freezing drizzle";
        case 57:
            return "Dense freezing drizzle";
        default:
            return "Unknown";
    }
}
