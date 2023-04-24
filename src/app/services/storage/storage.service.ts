import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

const store = new Storage();

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage: Storage = new Storage();

  constructor() {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async get(key: string): Promise<any> {
    return await this.storage.get(key);
  }

  async set(key: string, value: any) {
    this.storage.set(key, value);
  }
}