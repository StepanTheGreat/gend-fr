import { Injectable } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, setDoc, doc, getDoc, deleteDoc} from '@angular/fire/firestore';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { StorageService } from '../storage/storage.service';

const DEFAULT_DATA = {
  "scoreRight": 0,
  "scoreWrong": 0,
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?: User;

  constructor(
    private afAuth: Auth, 
    private afStore: Firestore, 
    private storageService: StorageService
  ) {
    this.afAuth.onAuthStateChanged(newUser => {
      this.user = (newUser) ? newUser : undefined;
      if (newUser) {
        this.initData(newUser);
      }
    });
  }

  async signIn(email: string, password: string): Promise<string> {
    let details: string = "";
    await signInWithEmailAndPassword(this.afAuth, email, password).then((credential) => {
      this.afAuth.updateCurrentUser(credential.user);
      details = "Succesfully logged in!";
    }).catch((reason) => {
      details = "Failed to log in.";
      console.log(reason);
    });
    return details;
  }

  async signUp(email: string, password: string): Promise<string> {

    createUserWithEmailAndPassword(this.afAuth, email, password).then((credential) => {
      this.afAuth.updateCurrentUser(credential.user);
    });

    return "";
  }

  signOut() {
    signOut(this.afAuth).then(() => {
      this.user = undefined;
    });
  }

  initData(user: User) {
    const userReference = doc(this.afStore, `users/${user.uid}`);

    getDoc(userReference).then((docSnapshot) => {
      if (!docSnapshot.exists()) {
        setDoc(userReference, DEFAULT_DATA);
      }
    });
  }

  deleteAccount() {
    if (this.user) {
      const userReference = doc(this.afStore, `users/${this.user.uid}`);

      getDoc(userReference).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          deleteDoc(userReference).then(() => {
            this.signOut();
          });
        }
      });      
    }
  }

}