import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  isColorThemeLight(): boolean {
    return document.body.getAttribute("color-theme") != "dark";
  }

  changeColorTheme() {
    let attr = document.body.getAttribute("color-theme");
    let theme = (attr == "dark") ? "light" : "dark";
    document.body.setAttribute("color-theme", theme);
  }
}
