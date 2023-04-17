import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings-content',
  templateUrl: './settings-content.component.html',
  styleUrls: ['./settings-content.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SettingsContentComponent {

  constructor() {}

  isColorThemeLight(): boolean {
    return document.body.getAttribute("color-theme") != "dark";
  }

  changeColorTheme() {
    let attr = document.body.getAttribute("color-theme");
    let theme = (attr == "dark") ? "light" : "dark";
    document.body.setAttribute("color-theme", theme);
  }

}