import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';

import { Subject } from 'rxjs';

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

  scoreRatio: number = 0;
  scoreRatioChange: Subject<number> = new Subject();

  constructor(private firebaseService: FirebaseService) { 
    firebaseService.userDataChange.subscribe((newData) => {
      this.scoreRight = newData.scoreRight;
      this.scoreWrong = newData.scoreWrong;
      this.scoreRatioChange.next(
        getRatio(this.scoreRight, this.scoreWrong)
      );
    });
  }

  updateScore(scoreEvent: number) {
    let event: ScoreAction = scoreEvent;
    if (event == ScoreAction.RightAdd) {
      this.scoreRight += 1;
    } else if (event == ScoreAction.WrongAdd) {
      this.scoreWrong += 1;
    }

    this.scoreRatioChange.next(
      getRatio(this.scoreRight, this.scoreWrong)
    );
    this.firebaseService.updateData({
      "scoreRight": this.scoreRight,
      "scoreWrong": this.scoreWrong,
    });
  }

  formatScore() {
    return `${getRatio(this.scoreRight, this.scoreWrong)}%`;
  }
}

function getRatio(num1: number, num2: number) {
  let all = Math.max(num1+num2, 1);
  let ratio = Math.round((num1/all)*100);
  return ratio;
}
