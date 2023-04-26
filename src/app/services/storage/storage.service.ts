import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

import * as fstorage from "@angular/fire/storage";
import * as istorage from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

type DictionaryType = {[key: number]: string[]};

const DEFAULT_DICT: DictionaryType = {
  0: [], 1: [], 2: []
}

type AppData = {
  dictVersion: string,
  dict: DictionaryType,
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  dictionary: DictionaryType = DEFAULT_DICT;
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

        this.dictionary = parsedDict;
        this.dictionaryVersion = version;

        await this.saveData();
      }
    }
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