import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

import * as fstorage from "@angular/fire/storage";
import * as istorage from '@ionic/storage';

type DictionaryType = {
  feminine:  string[],
  masculine: string[],
  plural:    string[]
}

type AppData = {
  dictVersion: string,
  dict: DictionaryType,
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  dictVersion: string = "";
  dict?: DictionaryType;

  constructor(
    private storage: istorage.Storage,
    private afStore: Firestore,
    private afStorage: fstorage.Storage
  ) {
    this.storage.create().then((storage) => {
      this.loadData();
    });
  }

  loadData() {
    this.get("appData").then((appData) => {
      if (appData) {
        this.dictVersion = appData.dictVersion;
        this.dict = appData.dict;      
      } else {
        this.initSTD();
      }
    });

    const docRef = doc(this.afStore, "config/dictionary");
    getDoc(docRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const version = data["version"];

        if (this.dictVersion != version) {
          const dictRef = fstorage.ref(this.afStorage, "words.json");
          // let dictBytes = fstorage.getBytes(dictRef);
          //console.log(dictBytes);
        }
      }
    });
  }

  initSTD() {
    // Standard application initialisation
    this.set("appData", {
      dictVersion: "0.0.0",
      dict: {
        feminine: [],
        masculine: [],
        plural: []
      }
    })
  }

  async get(key: string): Promise<any> {
    return await this.storage.get(key);
  }

  async set(key: string, value: any) {
    this.storage.set(key, value);
  }
}