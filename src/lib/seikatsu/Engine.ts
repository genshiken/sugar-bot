/** Sugar no Seikatsu - Kikai
 * Define user or player as state machine
 * Each player has their action points which replenish by 50 on each time transition
 * Max action points defined by base value and Sugar's stats
 */

import type { userstate } from "@prisma/client";
import { mutateState, type Action } from "./Actions";
import { events } from "./Events";
import { timeSection } from "./Schedule";

/** Sugar no *ryoku
 * Define stats and abilities Sugar has
 *
 * - Physical : self explanatory
 * - Affection : self explanatory
 * - Fatigue : dont abuse the cat
 * - Boredom : Sugar has heart too
 */
export type SugarStats = {
    physical: number;
    affection: number;
    fatigue: number;
    boredom: number;
};

export interface UserStateMachine {
    id: string;
    name: string;
    actionPoint: number;

    stats: SugarStats;
}

export const transitionState = (
    action: Action,
    time: Date,
    user: UserStateMachine
): UserStateMachine => {
    // determine if action is valid
    const section = timeSection(time);
    const validActions = events[section];
    const searchedAction = validActions.find((x) => x.name === action.name);
    if (!searchedAction) return user; //stops, return original state without mutating
    // mutate state
    let stat = { ...user.stats };
    stat = mutateState(searchedAction, stat);
    // consume action point
    user.actionPoint -= searchedAction.actionPoint;

    // define immutability
    let temp = { ...user };
    temp.stats = stat;
    return temp;
};

export const stateMachineDataFromUserState = (
    userState: userstate
): UserStateMachine => {
    return {
        id: userState.uid,
        name: "",
        actionPoint: userState.actionPoint,
        stats: {
            physical: userState.physical,
            affection: userState.affection,
            fatigue: userState.fatigue,
            boredom: userState.boredom,
        },
    };
};
