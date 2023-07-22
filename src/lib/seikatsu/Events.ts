import type { Action } from "./Actions";
import type { TimeSection } from "./Schedule";

/** Sugar no Seikatsu - Events
 * Define valid events for the given time slot
 */

export type Events = {
    [key in TimeSection]: Action[];
};

const morningEvents: Action[] = [
    {
        name: "mandi",
        actionPoint: 10,
        fatigue: -20,
        boredom: -5,
    },
    {
        name: "makan",
        actionPoint: 10,
        boredom: -10,
        // add hunger stat
    },
    {
        name: "olahraga",
        actionPoint: 20,
        physical: 1,
        fatigue: 20,
        affection: 5,
        boredom: -20,
    },
];

const noonEvents: Action[] = [
    {
        name: "tidur siang",
        actionPoint: 30,
        fatigue: -10,
        boredom: -30,
    },
    {
        name: "main",
        actionPoint: 15,
        boredom: -20,
        fatigue: -5,
        affection: 20,
    },
    {
        name: "makan",
        actionPoint: 10,
        boredom: -10,
        fatigue: -5,
    },
];

const nightEvents: Action[] = [
    {
        name: "mandi",
        actionPoint: 20,
        fatigue: -20,
        boredom: -20,
    },
    {
        name: "makan",
        actionPoint: 10,
        boredom: -10,
    },
    {
        name: "nonton bareng",
        actionPoint: 30,
        boredom: -30,
        affection: 10,
    },
];
export const events: Events = {
    morning: morningEvents,
    noon: noonEvents,
    night: nightEvents,
    sleep: [],
};
