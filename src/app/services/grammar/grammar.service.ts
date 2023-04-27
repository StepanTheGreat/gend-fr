import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { take } from 'rxjs';

type DictionaryType = string[];
type LearningDictionaryType = {[key: string]: string};
type LearnedDictionaryType = string[];

const DEFAULT_DICT: DictionaryType = [];
const DEFAULT_LEARNING_DICT: LearningDictionaryType = {};
const DEFAULT_LEARNED_DICT: LearnedDictionaryType = [];

const HOUR: number = 60 * 60000;
const DAY: number = HOUR * 24;

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
]

enum WordArticle {
  Masculine,
  Feminine,
  Plural,
  MasculinePlural,
  FemininePlural
}

@Injectable({
  providedIn: 'root'
})
export class GrammarService {

  dictionary: DictionaryType = DEFAULT_DICT;
  learningDictionary: LearningDictionaryType = DEFAULT_LEARNING_DICT; // A container with explored but not entirely leanred words
  learnedDictionary: LearnedDictionaryType = DEFAULT_LEARNED_DICT; // A container with fully learned words

  constructor(
    private storageService: StorageService
  ) { 
    this.storageService.loaded.pipe(take(2)).subscribe((loaded) => {
      if (loaded) {
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
    // Returns a word, its gender and the index
    let words: string[] = [];
    let randIndex: number = 0;

    let learnDict = Object.keys(this.learningDictionary);

    if (Math.random() > 0.5 && learnDict.length) {
      words = learnDict;
    } else {
      words = this.dictionary;
    } 
    randIndex = Math.round(Math.random()*(words.length-1));
    let word = words[randIndex];
    let gend = parseInt(word[0]);
    return [word.slice(1), gend];
  }

  updateWord(word: string, gender: number) {
    word = ("" + gender) + word;

    if (this.dictionary.includes(word)) {
      this.dictionary.splice(this.dictionary.indexOf(word), 1);

      const newDate = Date.now() + 3*DAY;
      this.learningDictionary[word] = "0"+newDate; 
    } else if (word in this.learningDictionary) {
      let stageAndDate = this.learningDictionary[word];
      let stage = parseInt(stageAndDate[0]) + 1;

      if (stage < 4) {
        let days = [3, 7, 21][stage];
        this.learningDictionary[word] = ( ("" + stage) + (Date.now() + days*DAY));
      } else {
        delete this.learningDictionary[word];
        this.learnedDictionary.push(word);
      }
    }
    this.saveWords();
  }

  saveWords() {
    this.storageService.set("dictionary", this.dictionary);
    console.log(this.learningDictionary);
    this.storageService.set("learningDictionary", this.learningDictionary);
    this.storageService.set("learnedDictionary", this.learnedDictionary);
  }
}

// The generation and word-picking process.

// After downloading a dictionary, the application converts the whole dictionary into 2 objects:

// A global dictionary:
// {
//   popularityRate: [
//       word
//       ...
//   ],
//   ...
// }

// A learning dictionary ( The same as the global dictionary, but with stages and dates) 

// Also, there will be a massive "knownWords" array, with just thousands of hashes of words that are picked for the learning purposes 
// (Doesn't matter if they're already learned or not).
// This way it won't add the same words if the dictionary get updated.

// Word generation:
// Quite simple. The generation will just pick up all the words from the most popular category.
// Each time it has a 50% chance of either picking a word in the **Learning** dictionary, or from the new.
// (NOTE: It cannot pick up the word that is on the time-stamp)
// 
// If a picked word is guessed wrong - it stays the same. The app might as well just push the same word all over again... That's neccessary.
// In other case, it will just get to the next stage until it's not learnt permanently.

// There are 3 stages to the learnt word:
// 0 - Show it again after 3 days
// 1 - Show it again after 7 days
// 2 - Show it again after 21 days
// After that, the word should be erased permanently from the **Learning** dictionary