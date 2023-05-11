import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthButtonComponent } from 'src/app/auth/auth-button/auth-button.component';
import { Router } from '@angular/router';
import { RegistrationContentComponent } from '../registration-content/registration-content.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule, FormsModule,
    AuthButtonComponent, RegistrationContentComponent
  ]
})
export class RegistrationPage {

  constructor(private router: Router) { 

  }

  returnToMain() {
    this.router.navigate([""]);
  }

  goToSettings() {
    this.router.navigate(["settings"]);
  }

}
