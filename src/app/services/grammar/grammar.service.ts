import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { take } from 'rxjs';

import { DictType, WordData } from "src/app/lib/types";
import { randomChoice } from 'src/app/lib/utils';

const HOUR: number = 60 * 60000;
const DAY: number = 24 * HOUR;

const ENDINGS = [
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

@Injectable({
  providedIn: 'root'
})
export class GrammarService {

  dictionary: DictType = {};
  activeDictionary: DictType = {};

  constructor(
    private storageService: StorageService
  ) { 
    this.storageService.loaded.pipe(take(2)).subscribe((loaded) => {
      if (loaded) {
        this.dictionary = storageService.dictionary;
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

  grammarError(word: string, suffix: string, wordData: WordData): string {
    const gender = wordDataToIndex(wordData);
    let genders = ["masculine", "feminine", "plural"];
    let txt = `The word \"${word+suffix}\" is ${genders[gender]}. `;
    if (suffix) {
        txt += `Pay closer attention to the suffix \"${suffix}\"`;
    } else if (gender != 2){
        txt += `This is an exception.`;
    }
    txt = "Temporarily doesn't work";
    return txt;
  }

  generateWord(): [string, WordData] {
    let allWords = Object.keys(this.dictionary);
    let word = randomChoice(allWords);
 
    return [word, this.dictionary[word]];
  }

  updateWordStage(word: string) {
    if (word in this.dictionary) {
      console.log("Updating the word...");
    }
    
  }

  saveWords() {
    this.storageService.set("dictionary", this.dictionary);
  }
}

function wordDataToIndex(data: WordData) {
  const numGender = ((+data.plural) << 1) & (+data.feminine);
  return Math.min(numGender, 3);
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