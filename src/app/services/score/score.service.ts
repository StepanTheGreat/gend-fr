import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';

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
  bestScoreRight: number = 0;
  bestScoreWrong: number = 0;
  totalGuessed: number = 0;

  scoreRight: number = 0;
  scoreWrong: number = 0;

  constructor(private firebaseService: FirebaseService) { 
    firebaseService.userDataChange.subscribe((newData) => {
      this.bestScoreRight = newData.bestScoreRight;
      this.bestScoreWrong = newData.bestScoreWrong;
      this.totalGuessed = newData.totalGuessed;
    });
  }

  updateScore(scoreEvent: number): string {
    let event: ScoreAction = scoreEvent;
    if (event == ScoreAction.RightAdd) {
      this.scoreRight += 1;
    } else if (event == ScoreAction.WrongAdd) {
      this.scoreWrong += 1;
    }
    this.totalGuessed += 1;
    let score = this.scoreRight+this.scoreWrong;
    let bestScore = this.bestScoreRight+this.bestScoreWrong;

    if (score >= bestScore) {
      let currentRatio = getRatio(this.scoreRight, this.scoreWrong)
      let bestRatio = getRatio(this.bestScoreRight, this.bestScoreWrong);
      if (currentRatio > bestRatio) {
        console.log(`New best score! ${currentRatio}/${bestRatio}`);
      }
    }

    return this.updateFormatScore();
  }

  updateFormatScore() {
    return `${getRatio(this.scoreRight, this.scoreWrong)}%`;
  }
}

function getRatio(num1: number, num2: number) {
  let all = Math.max(num1+num2, 1);
  let ratio = Math.round((num1/all)*100);
  return ratio;
}
