import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
  displayPassword: boolean = false;
  email: string = "";
  password: string = "";

  constructor(private authService: AuthService) { }

  showPassword() {
    this.displayPassword = !this.displayPassword;
  }

  newValueEmail(event: Event) {

  }

  newValuePassword(event: Event) {
    
  }

  signIn() {
    this.authService.signIn()
  }
}
