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

  appData?: AppData;

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
        this.appData = appData;
      } else {
        this.initSTD();
      }
      this.checkDictUpdates(this.appData!);
    });
  }

  initSTD() {
    // Standard application initialisation
    this.appData = {
      dictVersion: "0.0.0",
      dict: {
        feminine: [],
        masculine: [],
        plural: []
      }
    };
    this.set("appData", this.appData);
  }

  checkDictUpdates(appData: AppData) {
    const docRef = doc(this.afStore, "config/dictionary");
    getDoc(docRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const version = data["version"];

        if (this.appData?.dictVersion != version) {
          const dictRef = fstorage.ref(this.afStorage, "words.json");
          fstorage.getBytes(dictRef).then((bytes) => {
            const bstring = new TextDecoder().decode(bytes);
            let parsedDict = JSON.parse(bstring);

            appData.dict = parsedDict;
            appData.dictVersion = version;

            this.appData = appData;

            this.saveData();
            console.log(parsedDict);            
          });
        }
      }
    });
  }

  saveData() {
    this.set("appData", this.appData);
  }

  async get(key: string): Promise<any> {
    return await this.storage.get(key);
  }

  async set(key: string, value: any) {
    this.storage.set(key, value);
  }
}