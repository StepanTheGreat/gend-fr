import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';
import { CommonModule } from '@angular/common';

const WORDS: {[gender: number]: string[]} = {
  0: ["maleword1", "maleword2", "maleword3", "maleword4"],
  1: ["femaleword1", "femaleword2", "femaleword3", "femaleword4"],
  2: ["bothword1", "bothword2", "bothword3", "bothword4"],
};

const TO_RESET = 12;

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

  toReset: number = 0;

  word: string = "";
  wordGender: number = 0;

  @Output() scoreEvent = new EventEmitter<number>();

  constructor() {
    this.generateWord();
  }

  checkGender(gender: number) {
    if (this.wordGender == gender) {
      this.scoreEvent.emit(0);
    } else {
      this.scoreEvent.emit(1);
    }
    this.toReset += 1;
    if (this.toReset == TO_RESET) {
      this.toReset = 0;
      this.scoreEvent.emit(2);
    }
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
