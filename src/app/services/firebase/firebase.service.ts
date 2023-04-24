import { Injectable } from "@angular/core";
import { initializeApp, FirebaseApp } from "firebase/app";

import * as auth from "firebase/auth";
import * as firestore from "firebase/firestore";

import firebaseConfig from "firebase-config.json";
import { Subject } from "rxjs";
import { StorageService } from "../storage/storage.service";

const POLL_INTERVAL: number = 30 * 1000;

enum AuthStatus {
  LoggedOut,
  LoggingIn,
  LoggedIn
}

type UserDataType = {
  scoreRight: number,
  scoreWrong: number
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  signedInStatus: AuthStatus = AuthStatus.LoggedOut;
  signedInStatusChange: Subject<number> = new Subject();

  private userCredential?: auth.OAuthCredential;
  private userID: string = "";

  toSave: number = 0;

  changes: number = 0;

  app: FirebaseApp;
  db: firestore.Firestore;
  userData?: UserDataType;
  userDataChange: Subject<UserDataType> = new Subject<UserDataType>();

  auth: auth.Auth;
  googleAuthProvider: auth.GoogleAuthProvider;

  constructor(private storageService: StorageService) { 
    this.app = initializeApp(firebaseConfig);
    this.auth = auth.getAuth(this.app);
    this.googleAuthProvider = new auth.GoogleAuthProvider();
    this.db = firestore.getFirestore(this.app);

    this.signedInStatusChange.subscribe((newStatus: number) => {
      this.signedInStatus = newStatus;
    });

    setInterval(() => this.pollSave(), POLL_INTERVAL);
  }

  initData() {
    if (!this.isAuthenticated()) return;

    let docRef = firestore.doc(this.db, "users", this.userID);
    firestore.getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        let currentData = docSnap.data();
        this.userData = {
          "scoreRight": currentData["scoreRight"],
          "scoreWrong": currentData["scoreWrong"],
        }
        this.userDataChange.next(this.userData);
      } else {
        this.userData = {
          "scoreRight": 0,
          "scoreWrong": 0,
        }
        firestore.setDoc(docRef, this.userData);
        this.userDataChange.next(this.userData);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  updateData(newData: UserDataType) {
    if (!this.isAuthenticated()) return; 
    if (!this.userData) return;

    this.changes += 1;
    this.userData = newData;
  }

  resetScore() {
    if (!this.isAuthenticated()) return; 
    if (!this.userData) return;

    this.userData = { 
      "scoreRight": 0,
      "scoreWrong": 0,
    };
    this.userDataChange.next(this.userData);
    this.saveData();
  }

  deleteAccount() {
    if (!this.isAuthenticated()) return;

    let docRef = firestore.doc(this.db, "users", this.userID);
    firestore.deleteDoc(docRef).then(() => {
      this.signOut();
      console.log("Signing out...");
    }).catch((error) => {
      console.log(error);
    });
  }

  saveData() {
    if (!this.isAuthenticated()) return;
    if (!this.userData) return;
    
    let docRef = firestore.doc(this.db, "users", this.userID);
    firestore.setDoc(docRef, this.userData);
  }

  authenticate() {
    this.signedInStatusChange.next(AuthStatus.LoggingIn);
    auth.signInWithPopup(this.auth, this.googleAuthProvider)
      .then((result) => {
        this.signedInStatusChange.next(AuthStatus.LoggedIn);
        let credential = auth.GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          this.userCredential = credential;
          let user = this.auth.currentUser;
          if (user) {
            this.userID = user.uid;
            this.initData();
          }
        }
      }).catch((error) => {
        this.signedInStatusChange.next(AuthStatus.LoggedOut);
        console.log(error);
      });
  }

  isAuthenticated(): boolean {
    if (this.signedInStatus != AuthStatus.LoggedIn) return false;
    if (!this.userCredential) return false;
    if (this.userID == "") return false; 

    return true;
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.signedInStatusChange.next(AuthStatus.LoggedOut);
      this.userCredential = undefined;
      this.userID = "";
      this.userData = undefined;
      this.userDataChange.next({ 
        "scoreRight": 0,
        "scoreWrong": 0,
      });
    });
  }

  pollSave() {
    if (this.changes != 0) {
      this.changes = 0;
      this.saveData();
    }
  }
}
