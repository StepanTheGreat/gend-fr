import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';
import { CommonModule } from '@angular/common';
import { sliceWord } from "../../assets/grammar";
import wordsArray from "../../assets/words.json";


const DELAY: number = 1.5 * 1000;
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

  active: boolean = true;
  displayWord: string = "";
  displayEnding: string = "";
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
    if (this.wordGender == gender) {
      this.scoreEvent.emit(0);
    } else {
      let spliced = sliceWord(this.displayWord, this.wordGender);
      this.displayWord = spliced[0];
      this.displayEnding = spliced[1];
      console.log(spliced);
      this.scoreEvent.emit(1);
    }
    setTimeout(() => this.generateWord(), DELAY)
    //this.generateWord();
  }

  generateWord() {
    let gend: number = Math.round(Math.random()*2);
    let words = WORDS[gend];
    let randIndex = Math.round(Math.random()*(words.length-1))
    this.displayWord = words[randIndex];
    this.displayEnding = "";
    this.wordGender = gend;
    this.active = true;
  }
}
