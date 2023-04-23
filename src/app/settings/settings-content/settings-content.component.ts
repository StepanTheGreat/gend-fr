import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { ScoreService } from 'src/app/services/score/score.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-settings-content',
  templateUrl: './settings-content.component.html',
  styleUrls: ['./settings-content.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SettingsContentComponent {
  scoreRatio: number = 0;
  guesses: number = 0;

  alertHeader = "Are you sure you want to delete your account?";
  alertButtons = [
    {
      text: "Go back",
    },
    {
      text: "I'm sure",
      handler: () => { this.deleteAccount() }
    }
  ];
  
  constructor(
    private themeService: ThemeService,
    private scoreService: ScoreService,
    private firebaseService: FirebaseService
  ) {
    this.loadStats();
    this.scoreService.scoreRatioChange.subscribe((newRatio: number) => {
      this.scoreRatio = newRatio;
      this.guesses = (this.scoreService.scoreRight+this.scoreService.scoreWrong);
    })
  }

  loadStats() {
    this.guesses = (this.scoreService.scoreRight+this.scoreService.scoreWrong);
    this.scoreRatio = this.scoreService.scoreRatio;
  }

  isColorThemeLight(): boolean {
    return this.themeService.isColorThemeLight();
  }

  changeColorTheme() {
    this.themeService.changeColorTheme();
  }

  resetScore() {
    this.firebaseService.resetScore();
  }

  deleteAccount() {
    this.firebaseService.deleteAccount();
  }

}