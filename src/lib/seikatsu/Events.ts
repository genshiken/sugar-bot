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
    },
    {
        name: "makan",
        actionPoint: 10,
    },
    {
        name: "main",
        actionPoint: 20,
    },
];

const noonEvents: Action[] = [
    {
        name: "tidur siang",
        actionPoint: 30,
    },
    {
        name: "main",
        actionPoint: 15,
    },
    {
        name: "makan",
        actionPoint: 10,
    },
];

const nightEvents: Action[] = [
    {
        name: "mandi",
        actionPoint: 20,
    },
    {
        name: "makan",
        actionPoint: 10,
    },
    {
        name: "nonton",
        actionPoint: 30,
    },
    {
        name: "nggambar",
        actionPoint: 30,
    },
];
export const events: Events = {
    morning: morningEvents,
    noon: noonEvents,
    night: nightEvents,
    sleep: [],
};
