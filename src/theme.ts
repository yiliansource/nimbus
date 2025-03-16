export const dayTheme: ColorTheme = {
    foreground: [
        ["#632e58", "#491a41", "#431a3c", "#ac6482"],
        ["#9c416e", "#78315d", "#813462"],
    ],
    water: ["#fab0df", "#e7a7e2", "#e1a3e4"],
    mountains: [
        ["#b64d7e", "#cc6193"],
        ["#ce5c88", "#d25f91"],
        ["#de6c8e", "#f395aa"],
    ],
    background: ["#f86091", "#fff6d4"],
};

export const nightTheme: ColorTheme = {
    foreground: [
        ["#333462", "#19193d", "#19193d", "#333462"],
        ["#36396a", "#242951", "#36396a"],
    ],
    water: ["#6eb2cf", "#6f9fcc", "#6d8fce"],
    mountains: [
        ["#44568c", "#383d77"],
        ["#456999", "#3c5892"],
        ["#427b9f", "#4f92b1"],
    ],
    background: ["#372869", "#a7e5f3"],
};

export interface ColorTheme {
    foreground: [[string, string, string, string], [string, string, string]];
    water: [string, string, string];
    mountains: [[string, string], [string, string], [string, string]];
    background: [string, string];
}
