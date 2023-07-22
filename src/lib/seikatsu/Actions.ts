import type { SugarStats } from "./Engine";

export interface Action {
    name: string;
    actionPoint: number;
    physical?: number;
    affection?: number;
    fatigue?: number;
    boredom?: number;
}

export const mutateState = (action: Action, stat: SugarStats): SugarStats => {
    const state: SugarStats = { ...stat };

    if (action.physical) state.physical += action.physical;
    if (action.affection) state.affection += action.affection;
    if (action.fatigue) state.fatigue += action.fatigue;
    if (action.boredom) state.boredom += action.boredom;

    return state;
};
