import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';

import { CommonModule } from '@angular/common';

import { GrammarService } from 'src/app/services/grammar/grammar.service';
import { ScoreService } from 'src/app/services/score/score.service';

const DELAY: number = 1.5 * 2000;

@Component({
  selector: 'app-game-content',
  templateUrl: './game-content.component.html',
  styleUrls: ['./game-content.component.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule, 
    GenderBtnComponent
  ]
})
export class GameContentComponent {
  btnArticles: string[] = ["le", "la", "les", "un", "une", "des"];
  btnArticleIndex: number = 0;
  btnThemes: [number, number, number] = [0, 0, 0];

  active: boolean = true;
  displayWord: string = "";
  displayEnding: string = "";
  displayDescription: string = "";
  wordGender: number = 0;

  @Output() scoreEvent = new EventEmitter<number>();

  constructor(
    private grammarService: GrammarService,
    private scoreService: ScoreService
  ) {
    this.generateWord();
  }

  checkGender(gender: number) {
    if (!this.active) {
      return;
    }
    this.active = false;
    let delay = 1000;
    if (this.wordGender == gender) {
      this.btnThemes[this.wordGender] = 1;

      this.scoreService.updateScore(0);
    } else {
      delay = DELAY;
      let spliced = this.grammarService.sliceWord(this.displayWord, this.wordGender);
      this.displayWord = spliced[0];
      this.displayEnding = spliced[1];
      this.displayDescription = this.grammarService.grammarError(spliced[0], spliced[1], this.wordGender);
      this.btnThemes = [2, 2, 2];
      this.btnThemes[this.wordGender] = 1;

      this.scoreService.updateScore(1);
      
    }
    setTimeout(() => this.generateWord(), delay)
  }

  resetInfo() {
    this.displayDescription = "";
    this.displayEnding = "";
    this.btnThemes = [0, 0, 0];
    this.active = true;
  }

  generateWord() {
    let wordAndGend = this.grammarService.generateWord();
    this.displayWord = wordAndGend[0];
    this.wordGender = wordAndGend[1];
    this.btnArticleIndex = (this.btnArticleIndex + 3) % 6;
    this.resetInfo();
  }
}
