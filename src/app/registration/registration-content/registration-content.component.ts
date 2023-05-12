import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-registration-content',
  templateUrl: './registration-content.component.html',
  styleUrls: ['./registration-content.component.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule, 
  ]
})
export class RegistrationContentComponent {
  signedIn: boolean = false;
  displayPassword: boolean = false;
  email: string = "";
  password: string = "";
  description: string = "";

  constructor(
    private authService: AuthService,
    private afAuth: Auth
  ) { 
    this.afAuth.onAuthStateChanged(newUser => {
      this.signedIn = newUser? true : false;
    });
  }

  showPassword() {
    this.displayPassword = !this.displayPassword;
  }

  newValueEmail(event: any) {
    let target = event.target;
    if (target) {
      if (target.value) {
        this.email = target.value;
      }
    }
  }

  newValuePassword(event: any) {
    let target = event.target;
    if (target) {
      if (target.value) {
        this.password = target.value;
      }
    }
  }

  signIn() {
    this.authService.signIn(this.email, this.password).then((details) => {
      this.description = details;
    });
  }

  signUp() {
    this.authService.signUp(this.email, this.password);
  }

  signOut() {
    this.authService.signOut();
  }
}
