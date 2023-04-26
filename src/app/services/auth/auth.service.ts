import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, User, signInWithPopup, signOut } from '@angular/fire/auth';
import { Firestore, setDoc, doc, getDoc} from '@angular/fire/firestore';

const DEFAULT_DATA = {
  "scoreRight": 0,
  "scoreWrong": 0,
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?: User;

  constructor(private afAuth: Auth, private afStore: Firestore) {
    this.afAuth.onAuthStateChanged(newUser => {
      this.user = (newUser) ? newUser : undefined;
    });
  }

  signIn() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(this.afAuth, provider).then((credential) => {
      this.afAuth.updateCurrentUser(credential.user);
      this.initData(credential.user);
    });
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
    })
  }

}