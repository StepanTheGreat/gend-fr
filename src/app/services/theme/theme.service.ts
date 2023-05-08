import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  isColorThemeLight(): boolean {
    return !document.body.classList.contains("dark")
  }

  changeColorTheme() {
    if (this.isColorThemeLight()) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
}
