import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { FirebaseService } from 'src/app/services/firebase/firebase.service';

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
    "cloud-upload-outline",
    "cloud-done-outline"
  ];
  constructor(private firebaseService: FirebaseService) {
    this.authStatus = firebaseService.signedInStatus;
    firebaseService.signedInStatusChange.subscribe((newStatus: number) => {
      this.authStatus = newStatus;
    })
  }

  signIn() {
    this.firebaseService.firebaseAuth();
  }
}
