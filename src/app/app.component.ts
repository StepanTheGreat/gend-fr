import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Firestore, disableNetwork } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

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

  constructor() {
    disableNetwork(this.firestore);
  }

  async ngOnInit() {
    document.body.classList.add("dark");
  }

  public environmentInjector = inject(EnvironmentInjector);
}
