/**
 * Sugar no Seikatsu - Schedule
 * Divide single day into 4 main portions :
 * - Morning : 07.00 - 11.59
 * - Noon : 12.00 - 17.59
 * - Night : 18.00 - 23.59
 * - (Opt) Sleep : 24.00 - 06.59
 */

export enum TimeSection {
    MORNING = "morning",
    NOON = "noon",
    NIGHT = "night",
    SLEEP = "sleep",
}

/**
 * Return time section.
 * night : t < 7*3600
 *
 */

export const timeSection = (time: Date) => {
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const elapsed = hour * 3600 + minutes * 60 + seconds;
    if (elapsed < 7 * 3600) return TimeSection.SLEEP;
    else if (elapsed < 12 * 3600) return TimeSection.MORNING;
    else if (elapsed < 18 * 3600) return TimeSection.NOON;
    else return TimeSection.NIGHT;
};

export const printTimeSection = (time: TimeSection) => {
    return time.at(0)?.toUpperCase() + time.slice(1);
};
