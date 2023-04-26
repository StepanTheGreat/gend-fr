import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

type DictionaryType = {[key: number]: string[]};

const DEFAULT_DICT: DictionaryType = {
  0: [], 1: [], 2: []
}

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

  dictionary: DictionaryType = DEFAULT_DICT;

  constructor(
    private storageService: StorageService
  ) { 
    this.storageService.loaded.subscribe((value) => {
      if (value) {
        this.dictionary = storageService.dictionary;
      }
    });
  }

  sliceWord(word: string, gender: number): [string, string] {
    let endingCollection = ENDINGS[gender];
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

  grammarError(word: string, suffix: string, gender: number): string {
    let genders = ["masculine", "feminine", "plural"];
    let txt = `The word \"${word+suffix}\" is ${genders[gender]}. `;
    if (suffix) {
        txt += `Pay closer attention to the suffix \"${suffix}\"`;
    } else if (gender != 2){
        txt += `This is an exception.`;
    }   
    return txt;
  }

  generateWord(): [string, number] {
    let gend: number = Math.round(Math.random()*2);
    let words = this.dictionary[gend];
    let randIndex = Math.round(Math.random()*(words.length-1))
    return [words[randIndex], gend];
  }
}
