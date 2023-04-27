import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

import * as fstorage from "@angular/fire/storage";
import * as istorage from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

type DictionaryType = string[];
type LearningDictionaryType = {[key: string]: string};
type LearnedDictionaryType = string[];

const DEFAULT_DICT: DictionaryType = [];
const DEFAULT_LEARNING_DICT: LearningDictionaryType = {};
const DEFAULT_LEARNED_DICT: LearnedDictionaryType = [];

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  dictionary: DictionaryType = DEFAULT_DICT; // A container with lots of new words TO explore
  learningDictionary: LearningDictionaryType = DEFAULT_LEARNING_DICT; // A container with explored but not entirely leanred words
  learnedDictionary: LearnedDictionaryType = DEFAULT_LEARNED_DICT; // A container with fully learned words
  dictionaryVersion: string = "0.0.0";

  loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private storage: istorage.Storage,
    private afStore: Firestore,
    private afStorage: fstorage.Storage
  ) {
    this.storage.create().then(() => {
      this.loadData().then(() => {
        this.checkDictUpdates().then(() => {
          this.loaded.next(true);
        });
      });
    });
  }

  async loadData() {
    let dictionary = await this.get("dictionary");
    if (dictionary) {
      this.dictionary = dictionary;
    }

    let learningDictionary = await this.get("learningDictionary");
    if (learningDictionary) {
      this.learningDictionary = learningDictionary;
    }

    let learnedDictionary = await this.get("learnedDictionary");
    if (learnedDictionary) {
      this.learnedDictionary = learnedDictionary;
    }

    let dictionaryVersion = await this.get("dictionaryVersion");
    if (dictionaryVersion) {
      this.dictionaryVersion = dictionaryVersion;
    }
  }

  async checkDictUpdates() {
    const docRef = doc(this.afStore, "config/dictionary");
    let docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const version = data["version"];

      if (this.dictionaryVersion != version) {
        const dictRef = fstorage.ref(this.afStorage, "words.json");
        const dictBytes = await fstorage.getBytes(dictRef);
        const bstring = new TextDecoder().decode(dictBytes);
        let parsedDict = JSON.parse(bstring);

        this.dictionaryVersion = version;
        await this.mergeDicts(parsedDict);
      }
    }
  }

  async mergeDicts(newDict: DictionaryType) {
    newDict.forEach(word => {
      if (
        (word in this.learnedDictionary) ||
        (word in this.learningDictionary) ||
        (word in this.dictionary)
      ) {
        return;
      } else {
        this.dictionary.push(word);
      } 
    });
    await this.saveData();
  }
 
  async saveData() {
    await this.set("dictionaryVersion", this.dictionaryVersion);
    await this.set("dictionary", this.dictionary);
    await this.set("learningDictionary", this.learningDictionary);
    await this.set("learnedDictionary", this.learnedDictionary);
  }

  async get(key: string): Promise<any> {
    return await this.storage.get(key);
  }

  async set(key: string, value: any) {
    this.storage.set(key, value);
  }
}