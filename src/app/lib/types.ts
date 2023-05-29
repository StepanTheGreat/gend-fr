export type DictType = {
    [word: string] : {
        feminine: boolean,
        frequency: number,
        learnStage: number,
        showAgainAt: number
    }
}

export interface WordData {
    feminine: boolean,
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