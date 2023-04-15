import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';

const WORDS: {[gender: number]: string[]} = {
  0: ["maleword1", "maleword2", "maleword3", "maleword4"],
  1: ["femaleword1", "femaleword2", "femaleword3", "femaleword4"],
  2: ["bothword1", "bothword2", "bothword3", "bothword4"],
}

@Component({
  selector: 'app-game-content',
  templateUrl: './game-content.component.html',
  styleUrls: ['./game-content.component.scss'],
  standalone: true,
  imports: [IonicModule, GenderBtnComponent, CommonModule]
})
export class GameContentComponent {
  right: number = 0;
  wrong: number = 0;

  word: string;
  wordGender: number;
  showInfo: boolean = false;
  constructor() {
    this.word = "megaWOrd";
    this.wordGender = 1;
  }

  checkGender(gender: number) {
    if (this.wordGender == gender) {
      this.right += 1;
    } else {
      this.wrong += 1;
    }
    this.showInfo = !this.showInfo;
    this.generateWord();
  }

  generateWord() {
    let gend: number = Math.round(Math.random()*2);
    let words = WORDS[gend];
    let randIndex = Math.round(Math.random()*(words.length-1))
    this.word = words[randIndex];
    this.wordGender = gend;
  }
}
