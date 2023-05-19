import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import firebaseConfig from "firebase-config.json";

import { provideFirebaseApp, initializeApp} from '@angular/fire/app';
import { provideFirestore, getFirestore} from '@angular/fire/firestore';
import { provideAuth, getAuth} from '@angular/fire/auth';
import * as fstorage from '@angular/fire/storage';
import * as istorage from '@ionic/storage-angular';

if (environment.production) {
  enableProdMode();
}

// let app = initializeApp(firebaseConfig);
// let auth: Auth;
// if (Capacitor.isNativePlatform()) {
//   console.error("ON CAPACITOR!!!");
//   auth = initializeAuth(app, {
//     persistence: indexedDBLocalPersistence,
//   });
// } else {
//   auth = getAuth();
// }


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    importProvidersFrom(istorage.IonicStorageModule.forRoot()),
    importProvidersFrom(fstorage.provideStorage(() => fstorage.getStorage())),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(firebaseConfig))),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideAuth(() => getAuth())),
    provideRouter(routes),
  ],
});
