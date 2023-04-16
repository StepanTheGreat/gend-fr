import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GenderBtnComponent } from '../gender-btn/gender-btn.component';
import { GameContentComponent } from '../game-content/game-content.component';

enum ScoreAction {
  RightAdd,
  WrongAdd,
  Reset,
  None
}

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
  scoreTxt: string = "0%";

  onScoreEvent(scoreEvent: number) {
    let event: ScoreAction = scoreEvent;
    if (event == ScoreAction.RightAdd) {
      this.scoreRight += 1;
    } else if (event == ScoreAction.WrongAdd) {
      this.scoreWrong += 1;  
    } else if (event == ScoreAction.Reset) {
      this.scoreRight = 0;
      this.scoreWrong = 0;
    }
    this.updateScore();
  }

  updateScore() {
    let all = Math.max(this.scoreWrong+this.scoreRight, 1);
    let percent = Math.round((this.scoreRight/all)*100);
    this.scoreTxt = `${percent}%`;
  }
}
