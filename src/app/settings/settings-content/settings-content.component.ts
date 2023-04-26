import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
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
    private authService: AuthService
  ) {
    this.guesses = (this.scoreService.scoreRight+this.scoreService.scoreWrong);
    this.scoreRatio = this.scoreService.scoreRatio;

    this.scoreService.scoreRatioChange.subscribe((newRatio: number) => {
      this.scoreRatio = newRatio;
      this.guesses = (this.scoreService.scoreRight+this.scoreService.scoreWrong);
    });
  }

  isColorThemeLight(): boolean {
    return this.themeService.isColorThemeLight();
  }

  changeColorTheme() {
    this.themeService.changeColorTheme();
  }

  resetScore() {
    this.scoreService.resetScore();
  }

  deleteAccount() {
    this.authService.deleteAccount();
  }

}