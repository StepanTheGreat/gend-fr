import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';
import { CommonModule } from '@angular/common';
import { sliceWord, grammarError } from "../../assets/grammar";
import wordsArray from "../../assets/words.json";

const DELAY: number = 1.5 * 2000;
const WORDS: {[gender: number]: string[]} = {
  0: wordsArray[0],
  1: wordsArray[1],
  2: wordsArray[2],
};

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

  buttonThemes: [number, number, number] = [0, 0, 0];

  active: boolean = true;
  displayWord: string = "";
  displayEnding: string = "";
  displayDescription: string = "";
  wordGender: number = 0;

  @Output() scoreEvent = new EventEmitter<number>();

  constructor() {
    this.generateWord();
  }

  checkGender(gender: number) {
    if (!this.active) {
      return;
    }
    this.active = false;
    let delay = 1000;
    if (this.wordGender == gender) {
      this.buttonThemes[this.wordGender] = 1;

      this.scoreEvent.emit(0);
    } else {
      delay = 2500;
      let spliced = sliceWord(this.displayWord, this.wordGender);
      this.displayWord = spliced[0];
      this.displayEnding = spliced[1];
      this.displayDescription = grammarError(spliced[0], spliced[1], this.wordGender);
      this.buttonThemes = [2, 2, 2];
      this.buttonThemes[this.wordGender] = 1;

      this.scoreEvent.emit(1);
      
    }
    setTimeout(() => this.generateWord(), delay)
  }

  resetInfo() {
    this.displayDescription = "";
    this.displayEnding = "";
    this.buttonThemes = [0, 0, 0];
    this.active = true;
  }

  generateWord() {
    let gend: number = Math.round(Math.random()*2);
    let words = WORDS[gend];
    let randIndex = Math.round(Math.random()*(words.length-1))
    this.displayWord = words[randIndex];
    this.wordGender = gend;
    this.resetInfo();
  }
}
