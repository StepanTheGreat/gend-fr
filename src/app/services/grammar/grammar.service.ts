import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { take } from 'rxjs';

import { DictType, WordData } from "src/app/lib/types";
import { randomChoice, weightedRandomWord } from 'src/app/lib/utils';

const HOUR: number = 60 * 60000;
const DAY: number = 24 * HOUR;

const ENDINGS: string[][] = [
  [
    "age", "an", "c", "d", "eme", "g", "i", "in", "is", "iste",
    "k", "l", "lon", "m", "non", "o", "ome", "r", "ron", "sme", 
    "t", "taire", "ton", "tre", "u", "us"
  ],
  [
    "ade", "aison", "ce", "ee", "ie", "iere", "ine", "ion", "ite",
    "lle", "se", "tte", "ude", "ure"
  ],
  [
    "x", "aux", "ails", "ous"
  ]
];

const STAGE_WAITING: {[stage: number]: number} = {
  1: DAY,
  2: 3*DAY,
  3: 7*DAY,
  4: 21*DAY
};

@Injectable({
  providedIn: 'root'
})
export class GrammarService {

  dictionary: DictType = {};
  progresslessMode: boolean = false;
  avaiableWords: number = 0;
  learnedWords: number = 0;

  constructor(
    private storageService: StorageService
  ) { 
    this.storageService.loaded.pipe(take(2)).subscribe((loaded) => {
      if (loaded) {
        this.dictionary = storageService.dictionary;
        this.avaiableWords = this.checkAvaiableWords();
        if (this.avaiableWords == 0) {
          this.progresslessMode = true;
        }
      }
    });
  }

  sliceWord(word: string, wordData: WordData): [string, string] {
    let endingCollection = ENDINGS[wordDataToIndex(wordData)];
    let result: [string, string] = [word, ""];
    endingCollection.forEach(suff => {
      if (word.endsWith(suff)) {
        result = [
          word.substring(0, word.length - suff.length),
          suff
        ]
      }
    });
    return result;
  }

  checkAvaiableWords(): number {
    let wordsCounter = 0;
    let currentDate = Date.now();
    for(const [_, wordData] of Object.entries(this.dictionary)) {
      if (currentDate > wordData.showAgainAt) {
        wordsCounter += 1;
      }
    }
    return wordsCounter;
  }

  generateWord(): [string, WordData] {
    let currentDate = Date.now();
    let avaiableWords = [];
    for(const [word, wordData] of Object.entries(this.dictionary)) {
      if (this.progresslessMode || currentDate > wordData.showAgainAt) {
        avaiableWords.push(word);
      }
    } 
    let word = weightedRandomWord(avaiableWords, this.dictionary);
    let wordData = this.dictionary[word];
 
    return [word, wordData];
  }

  updateWordStage(word: string) {
    if (this.progresslessMode) return;
    if (word in this.dictionary) {
      let dictWord = this.dictionary[word];

      dictWord.learnStage += 1;
      dictWord.showAgainAt = Date.now() + STAGE_WAITING[dictWord.learnStage];
    }
    this.avaiableWords -= 1;
    if (this.avaiableWords <= 0) {
      this.progresslessMode = true;
    }
    this.learnedWords += 1;

    this.saveWords();
  }

  saveWords() {
    this.storageService.set("dictionary", this.dictionary);
  }
}

function wordDataToIndex(data: WordData) {
  if (data.plural) {
    return 2;
  } else {
    return (data.feminine) ? 1 : 0;
  }
}

// Word structure:
// "word": {
//    
//   feminine: boolean,
//   plural: boolean,
//   frequency: number (0-1),
//   learnStage: number (0-4),
//   showAgainAt: number (date)
// }

// All stored in a massive dictionary object

// There are 5 stages to learn a word:
// 0 - Unknown
// 1 - Show it again after 1 day
// 2 - Show it again after 3 days
// 3 - Show it again after 7 days
// 4 - Show it again after 21 days