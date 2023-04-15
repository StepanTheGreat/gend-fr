import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

interface AppState {
  scoreWrong: number;
  scroeCorrect: number;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);

  scoreCorrect$: Observable<number>;
  scoreWrong$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.scoreCorrect$ = this.store.select("scroeCorrect");
    this.scoreWrong$ = this.store.select("scroeCorrect");
  }
}
