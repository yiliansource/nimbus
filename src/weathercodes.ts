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
