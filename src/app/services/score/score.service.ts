import { Injectable } from '@angular/core';

import { StorageService } from "src/app/services/storage/storage.service";

import { Observable, Subject } from 'rxjs';
import { Firestore, doc, getDoc, setDoc, Unsubscribe, onSnapshot } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

enum ScoreAction {
  RightAdd,
  WrongAdd,
  Reset,
  None
}

type userData = {
  scoreRight: number,
  scoreWrong: number
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  scoreRight: number = 0;
  scoreWrong: number = 0;

  snapshotSubscription?: Unsubscribe;

  scoreRatio: number = 0;
  scoreRatioChange: Subject<number> = new Subject();

  constructor(
    private afStore: Firestore,
    private afAuth: Auth,
    private storageService: StorageService
  ) { 
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(this.afStore, `users/${user.uid}`);
        if (this.snapshotSubscription) this.snapshotSubscription();

        this.snapshotSubscription = onSnapshot(docRef, (snapshot: any) => { 
          const data = snapshot.data();
          this.scoreRight = data["scoreRight"];
          this.scoreWrong = data["scoreWrong"];
          this.updateRatioScore();
        });
      } else {
        if (this.snapshotSubscription) this.snapshotSubscription();
        this.scoreRight = 0;
        this.scoreWrong = 0;
        this.updateRatioScore();
      }
    });
  }

  updateScore(scoreEvent: number) {
    if (scoreEvent == ScoreAction.RightAdd) {
      this.scoreRight += 1;
    } else if (scoreEvent == ScoreAction.WrongAdd) {
      this.scoreWrong += 1;
    }

    this.updateRatioScore();
    this.setScore({
      "scoreRight": this.scoreRight,
      "scoreWrong": this.scoreWrong,
    });
  }

  resetScore() {
    this.setScore({
      "scoreRight": 0,
      "scoreWrong": 0,
    });
  }

  setScore(newScore: userData) {
    let user = this.afAuth.currentUser;
    if (user) {
      const docRef = doc(this.afStore, `users/${user.uid}`);
      setDoc(docRef, newScore);
    }
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
