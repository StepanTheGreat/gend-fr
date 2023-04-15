import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';
import { GameContentComponent } from '../game-content/game-content.component';

import { Action } from '@ngrx/store';

@Component({
  selector: 'app-index',
  templateUrl: 'index.page.html',
  styleUrls: ['index.page.scss'],
  standalone: true,
  imports: [IonicModule, GenderBtnComponent, GameContentComponent],
})
export class IndexPage {
  scoreRight: number = 0;
  scoreWrong: number = 0;


}
