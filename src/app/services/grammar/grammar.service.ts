import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { take } from 'rxjs';

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

  dictionary: string[] = [];
  learningDictionary: {[key: string]: string} = {}; // A container with explored but not entirely leanred words
  learnedDictionary: string[] = []; // A container with fully learned words
  activeKeysLearningDictionary: string[] = [];

  constructor(
    private storageService: StorageService
  ) { 
    this.storageService.loaded.pipe(take(2)).subscribe((loaded) => {
      if (loaded) {
        this.dictionary = storageService.dictionary;
        this.learningDictionary = storageService.learningDictionary;
        this.learnedDictionary = storageService.learnedDictionary;
        this.activeKeysLearningDictionary = storageService.activeKeysLearningDictionary;
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

    if (Math.random() < 0.35 && this.activeKeysLearningDictionary.length) {
      words = this.activeKeysLearningDictionary;
    } else {
      words = this.dictionary;
    } 
    randIndex = Math.round(Math.random()*(words.length-1));
    return unpackWord(words[randIndex]);
  }

  updateWord(word: string, gender: number) {
    word = packWord(word, gender);

    if (this.dictionary.includes(word)) {
      this.dictionary.splice(this.dictionary.indexOf(word), 1);

      this.learningDictionary[word] = packWordData(0, Date.now()+3*DAY); 
    } else if (this.activeKeysLearningDictionary.includes(word)) {
      this.activeKeysLearningDictionary.splice(this.activeKeysLearningDictionary.indexOf(word), 1);

      let stageAndDate = unpackWordData(this.learningDictionary[word]);
      let stage = stageAndDate[0]+1;
      
      if (stage < 3) {
        let days = [3, 7, 21][stage];
        console.log(days);
        this.learningDictionary[word] = packWordData(stage, Date.now()+days*DAY);
      } else {
        delete this.learningDictionary[word];
        this.learnedDictionary.push(word);
      }
    }
    this.saveWords();
  }

  saveWords() {
    this.storageService.set("dictionary", this.dictionary);
    this.storageService.set("learningDictionary", this.learningDictionary);
    this.storageService.set("learnedDictionary", this.learnedDictionary);
  }
}

// Packed word data is a storage-efficient combination of word stage and date to review the word.
// Packed words on the other hand, just combine words gender and the word itself in compact way.

function unpackWordData(wordData: string): [number, number] {
  return [
    parseInt(wordData[0]),
    parseInt(wordData.slice(1))
  ]
}

function packWordData(wordStage: number, wordDate: number): string {
  return (""+wordStage) + wordDate;
}

function packWord(word: string, gender: number): string {
  return ("" + gender) + word;
}

function unpackWord(word: string): [string, number] {
  return [
    word.slice(1),
    parseInt(word[0])
  ]
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