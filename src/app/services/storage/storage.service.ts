import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

import * as fstorage from "@angular/fire/storage";
import * as istorage from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

import { DictType } from 'src/app/lib/types';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  dictionary: DictType = {};
  activeDictionary: DictType = {};
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

  async mergeDicts(newDict: DictType) {
    for(const [word, wordData] of Object.entries(newDict)) {
      if (!(word in this.dictionary)) {
        this.dictionary[word] = {
          feminine: wordData["feminine"],
          plural: wordData["plural"],
          dualAnswer: wordData["dualAnswer"],
          frequency: wordData["frequency"],
          learnStage: 0,
          showAgainAt: 0,
        };
      }
    }
    await this.saveData();
  }
 
  async saveData() {
    await this.set("dictionaryVersion", this.dictionaryVersion);
    await this.set("dictionary", this.dictionary);
  }

  async get(key: string): Promise<any> {
    return await this.storage.get(key);
  }

  async set(key: string, value: any) {
    this.storage.set(key, value);
  }
}