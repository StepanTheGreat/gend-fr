import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule
  ]
})
export class AppComponent implements OnInit {

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  async ngOnInit() {
    document.body.classList.add("dark");
  }

  public environmentInjector = inject(EnvironmentInjector);
}
