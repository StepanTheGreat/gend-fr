import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-settings-content',
  templateUrl: './settings-content.component.html',
  styleUrls: ['./settings-content.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SettingsContentComponent {

  constructor(private themeService: ThemeService) {}

  isColorThemeLight(): boolean {
    return this.themeService.isColorThemeLight();
  }

  changeColorTheme() {
    this.themeService.changeColorTheme();
  }

}