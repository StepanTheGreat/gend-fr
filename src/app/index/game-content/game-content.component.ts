import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';

import { CommonModule } from '@angular/common';

import { GrammarService } from 'src/app/services/grammar/grammar.service';
import { ScoreService } from 'src/app/services/score/score.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { take } from 'rxjs';

import { ScoreAction, WordData } from 'src/app/lib/types';

const COOLDOWN_WON: number = 1000;
const COOLDOWN_LOST: number = 2500;
const WORDS_PER_DAY: number = 64;

const ARTICLES: {[key: string]: [string, string]} = {
  "masculine": ["le", "un"],
  "feminine":  ["la", "une"],
  "plural":    ["les", "des"]
};

enum ButtonTheme {
  Default,
  Correct,
  Invalid
}

enum ButtonIndex {
  Masculine,
  Feminine,
  Plural
}

type GenderButton = {
  articles: string[],
  btnTheme: number,
  btnIndex: number
}

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
  articleIndex: number = 0;

  shownCongratulations: boolean = false;
  alertOpen: boolean = false;
  alertHeader: string = "Well done! You can take a rest now and learn more tomorrow!";
  alertButtons = [
    {
      text: "Great",
      handler: () => this.alertOpen = false,
    },
  ];
  gameButtons: GenderButton[] = [
    {
      articles: ARTICLES["masculine"],
      btnTheme: ButtonTheme.Default,
      btnIndex: ButtonIndex.Masculine
    },
    {
      articles: ARTICLES["feminine"],
      btnTheme: ButtonTheme.Default,
      btnIndex: ButtonIndex.Feminine
    },
    {
      articles: ARTICLES["plural"],
      btnTheme: ButtonTheme.Default,
      btnIndex: ButtonIndex.Plural
    },
  ];
  correctButtons: number[] = [];

  interactable: boolean = false;
  word: string = "";
  wordData: WordData = {
    feminine: false,
    plural: false,
    dualAnswer: false,
    frequency: 0.0
  };
  wordEnding: string = "";

  constructor(
    private grammarService: GrammarService,
    private scoreService: ScoreService,
    private storageService: StorageService,
  ) {
    this.word = "loading...";
    this.storageService.loaded.pipe(take(2)).subscribe((loaded) => {
      if (loaded) {
        this.interactable = true;
        this.generateWord();
      }
    }); 
  }

  checkGender(buttonIndex: number) {
    if (!this.interactable) return;
    const correctAnswer = this.correctButtons.includes(buttonIndex);

    this.interactable = false;
    if (correctAnswer) {
      this.gameButtons[buttonIndex].btnTheme = ButtonTheme.Correct;

      this.grammarService.updateWordStage(this.word);
      this.scoreService.updateScore(ScoreAction.RightAdd);

      if (this.grammarService.learnedWords >= WORDS_PER_DAY && !this.shownCongratulations) {
        this.shownCongratulations = true;
        this.alertOpen = true;
      }

    } else {
      let [word, wordEnding] = this.grammarService.sliceWord(this.word, this.wordData);
      this.word = word;
      this.wordEnding = wordEnding;

      this.gameButtons.forEach((button) => {
        if (this.correctButtons.includes(button.btnIndex)) {
          button.btnTheme = ButtonTheme.Correct;
        } else {
          button.btnTheme = ButtonTheme.Invalid;
        }
      });
      this.scoreService.updateScore(ScoreAction.WrongAdd); 
    }

    const gameCooldown = (correctAnswer) ? COOLDOWN_WON : COOLDOWN_LOST;
    setTimeout(() => this.generateWord(), gameCooldown);
  }

  resetDisplayText() {
    this.wordEnding = "";
    this.gameButtons.forEach((_, btnIndex) => {
      this.gameButtons[btnIndex].btnTheme = ButtonTheme.Default;
    });
    this.interactable = true;
  }

  generateWord() {
    const [word, wordData] = this.grammarService.generateWord();

    this.word = word;
    this.wordData = wordData;
    this.setupButtons();
    this.resetDisplayText();
  }

  setupButtons() {
    this.articleIndex = Math.round(Math.random());
    this.correctButtons = [];

    if (this.wordData.plural) {
      this.correctButtons.push(ButtonIndex.Plural);
    }

    if (!this.wordData.plural || this.wordData.dualAnswer) {
      if (this.wordData.feminine) {
        this.correctButtons.push(ButtonIndex.Feminine);
      } else {
        this.correctButtons.push(ButtonIndex.Masculine);
      }
    }

  }
}