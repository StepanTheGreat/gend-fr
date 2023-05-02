export type DictType = {
    [word: string] : {
        feminine: boolean,
        plural: boolean,
        dualAnswer: boolean,
        frequency: number,
        learnStage: number,
        showAgainAt: number
    }
}

export interface WordData {
    feminine: boolean,
    plural: boolean,
    dualAnswer: boolean,
    frequency: number
}

export enum ScoreAction {
    RightAdd,
    WrongAdd,
}
  
export type userData = {
    scoreRight: number,
    scoreWrong: number
}