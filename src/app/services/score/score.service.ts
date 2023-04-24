import { Injectable } from '@angular/core';
import { FirebaseService } from "src/app/services/firebase/firebase.service";

import { StorageService } from "src/app/services/storage/storage.service";

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

  constructor(
    private firebaseService: FirebaseService,
    private storageService: StorageService
  ) { 
    let userData = firebaseService.userData;
    if (userData) {
      this.scoreRight = userData.scoreRight;
      this.scoreWrong = userData.scoreWrong;
    } else {
      this.storageService.get("userData").then(localData => {
        if (localData) {
          this.scoreRight = localData.scoreRight;
          this.scoreWrong = localData.scoreWrong;
          this.updateRatioScore();
        }
      });
    }
    
    firebaseService.userDataChange.subscribe((newData) => {
      this.scoreRight = newData.scoreRight;
      this.scoreWrong = newData.scoreWrong;
      this.updateRatioScore();
      this.storageService.set("userData", newData);
    });
  }

  updateScore(scoreEvent: number) {
    let event: ScoreAction = scoreEvent;
    if (event == ScoreAction.RightAdd) {
      this.scoreRight += 1;
    } else if (event == ScoreAction.WrongAdd) {
      this.scoreWrong += 1;
    }

    this.updateRatioScore();
    let newData = {
      "scoreRight": this.scoreRight,
      "scoreWrong": this.scoreWrong,
    };
    this.firebaseService.updateData(newData);
    this.storageService.set("userData", newData);
  }

  resetScore() {
    this.storageService.set("userData", {"scoreRight":0,"scoreWrong":0});
    this.firebaseService.resetScore();
  }

  updateRatioScore() {
    this.scoreRatio = getRatio(this.scoreRight, this.scoreWrong);
    this.scoreRatioChange.next(this.scoreRatio);
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
