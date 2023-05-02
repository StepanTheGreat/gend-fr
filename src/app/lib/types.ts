export type DictType = {
    [word: string] : {
        feminine: boolean,
        plural: boolean,
        dualAnswer: boolean,
        freq: number,
        learnStage: number,
        showAgainAt: number
    }
}

export interface WordData {
    feminine: boolean,
    plural: boolean,
    dualAnswer: boolean,
    freq: number
}

export enum ScoreAction {
    RightAdd,
    WrongAdd,
}
  
export type userData = {
    scoreRight: number,
    scoreWrong: number
}