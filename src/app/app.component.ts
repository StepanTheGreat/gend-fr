import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ThemeService } from './services/theme/theme.service';

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

export class AppComponent {

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  constructor(private themeService: ThemeService) {

  }

  public environmentInjector = inject(EnvironmentInjector);
}
