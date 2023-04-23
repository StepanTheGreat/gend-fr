import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from 'src/app/index/gender-btn/gender-btn.component';
import { GameContentComponent } from "src/app/index/game-content/game-content.component";
import { AuthButtonComponent } from 'src/app/auth/auth-button/auth-button.component';

import { ScoreService } from "src/app/services/score/score.service";

import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: 'index.page.html',
  styleUrls: ['index.page.scss'],
  standalone: true,
  imports: [IonicModule, GenderBtnComponent, GameContentComponent, AuthButtonComponent],
})
export class IndexPage {
  scoreTxt: string = "0%";

  constructor(
    private router: Router, 
    private scoreService: ScoreService,
  ) {
    this.scoreTxt = `${scoreService.scoreRatio}%`;
    scoreService.scoreRatioChange.subscribe((newRatio) => {
      this.scoreTxt = `${newRatio}%`
    });
  }

  onScoreEvent(scoreEvent: number) {
    this.scoreService.updateScore(scoreEvent);
  }

  goToSettings() {
    this.router.navigate(["settings"]);
  }
}
