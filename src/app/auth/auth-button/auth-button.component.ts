import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Auth } from '@angular/fire/auth';

enum SignInStatus{ LoggedOff, LoggedIn };

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AuthButtonComponent {

  authStatus: number = 0;
  authIcons: string[] = [
    "cloud-offline-outline",
    "cloud-done-outline"
  ];
  constructor(
    private authService: AuthService,
    private afAuth: Auth
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.authStatus = SignInStatus.LoggedIn;
      } else {
        this.authStatus = SignInStatus.LoggedOff;
      }
    })
  }

  signInAndOut() {
    if (this.authStatus == SignInStatus.LoggedOff) {
      this.authService.signIn();
    } else {
      this.authService.signOut();
    }
  }
}
