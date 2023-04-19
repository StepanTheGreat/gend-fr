import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';
import { CommonModule } from '@angular/common';

import { GrammarService } from 'src/app/grammar.service';

const wordsArray = [
  [
      "homme", "garçon", "père", "frère", "fils", "ami", "voisin", "chien", "chat", "cheval", "oiseau", "poisson", "arbre", "bateau", "avion", "train", 
      "vélo", "ordinateur", "téléphone", "livre", "journal", "film", "jeu", "sport", "instrument", "artiste", "médecin", "professeur", "étudiant", "ingénieur", 
      "avocat", "police", "soldat", "chef", "président", "roi", "dieu"
  ],
  [
      "femme", "fille", "mère", "soeur", "fille", "amie", "voisine", "chienne", "chatte", "jument", "poule", "vache", "maison", "voiture", "moto", "poussette", 
      "valise", "cuisine", "école", "université", "musique", "peinture", "sculpture", "littérature", "philosophie", "religion", "science", "histoire", "géographie", 
      "économie", "politique", "société", "entreprise", "association", "administration", "armée", "royauté", "divinité"
  ],
  [
      "ami", "voisin", "acteur", "étudiant", "chanteur", "danseur", "photographe", "journaliste", "écrivain", "chercheur", "volontaire", "bénévole", 
      "travailleur", "citoyen", "touriste", "artiste", "professeur", "personne"
  ]
]

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

  constructor(private grammarService: GrammarService) {
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
      delay = DELAY;
      let spliced = this.grammarService.sliceWord(this.displayWord, this.wordGender);
      this.displayWord = spliced[0];
      this.displayEnding = spliced[1];
      this.displayDescription = this.grammarService.grammarError(spliced[0], spliced[1], this.wordGender);
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
