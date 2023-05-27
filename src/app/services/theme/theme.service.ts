import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private storageService: StorageService) {
    this.storageService.get("lightTheme").then((lightTheme) => this.initTheme(lightTheme));
  }

  async initTheme(lightTheme?: boolean) {
    if (typeof lightTheme != "boolean") {
      lightTheme = true;
      await this.storageService.set("lightTheme", true);
    }
    if (this.isColorThemeLight() != lightTheme) {
      this.changeColorTheme();
    }
  }

  isColorThemeLight(): boolean {
    return !document.body.classList.contains("dark");
  }

  changeColorTheme() {
    if (this.isColorThemeLight()) {
      document.body.classList.add("dark");
      this.storageService.set("lightTheme", false);
    } else {
      document.body.classList.remove("dark");
      this.storageService.set("lightTheme", true);
    }
  }
}
