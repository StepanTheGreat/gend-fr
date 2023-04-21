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
  scoreRight: number = 0;
  scoreWrong: number = 0;

  constructor(private firebaseService: FirebaseService) { 
    firebaseService.userDataChange.subscribe((newData) => {
      this.scoreRight = newData.scoreRight;
      this.scoreWrong = newData.scoreWrong;
    });
  }

  updateScore(scoreEvent: number): string {
    let event: ScoreAction = scoreEvent;
    if (event == ScoreAction.RightAdd) {
      this.scoreRight += 1;
    } else if (event == ScoreAction.WrongAdd) {
      this.scoreWrong += 1;
    }

    this.firebaseService.updateData({
      "scoreRight": this.scoreRight,
      "scoreWrong": this.scoreWrong,
    });

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
