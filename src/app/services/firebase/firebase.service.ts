import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';

import { getAuth, Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore/lite';

import firebaseConfig from "firebase-config.json";
import { Subject } from 'rxjs';

enum AuthStatus {
  LoggedOut,
  LoggingIn,
  LoggedIn
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // 0 - Not logged in, 1 - Logging in, 2 - Logged in
  signedInStatus: AuthStatus = AuthStatus.LoggedOut;
  signedInStatusChange: Subject<number> = new Subject<number>();

  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  googleAuthProvider: GoogleAuthProvider;
  constructor() { 
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.googleAuthProvider = new GoogleAuthProvider();
    this.db = getFirestore(this.app);

    this.signedInStatusChange.subscribe((newStatus: number) => {
      this.signedInStatus = newStatus;
    });

    console.log("Firebase initialised!");
  }

  firebaseAuth() {
    this.signedInStatusChange.next(AuthStatus.LoggingIn);
    signInWithPopup(this.auth, this.googleAuthProvider)
      .then((result) => {
        this.signedInStatusChange.next(AuthStatus.LoggedIn);
        let credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          let token = credential.accessToken;
          let user = result.user;
          console.log(user.displayName);
        }
      }).catch((error) => {
        this.signedInStatusChange.next(AuthStatus.LoggedOut);
        console.log(error);
      });
  }
}
