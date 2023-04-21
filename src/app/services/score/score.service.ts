import { Injectable } from '@angular/core';

enum ScoreAction {
  RightAdd,
  WrongAdd,
  Reset,
  None
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  scoreRight: number = 0;
  scoreWrong: number = 0;

  constructor() { 
    
  }

  updateScore(scoreEvent: number): string {
    let event: ScoreAction = scoreEvent;
    if (event == ScoreAction.RightAdd) {
      this.scoreRight += 1;
    } else if (event == ScoreAction.WrongAdd) {
      this.scoreWrong += 1;  
    } else if (event == ScoreAction.Reset) {
      this.scoreRight = 0;
      this.scoreWrong = 0;
    }
    return this.updateFormatScore();
  }

  updateFormatScore() {
    let all = Math.max(this.scoreWrong+this.scoreRight, 1);
    let percent = Math.round((this.scoreRight/all)*100);
    return `${percent}%`;
  }
}
