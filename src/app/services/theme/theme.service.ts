import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private storageService: StorageService) {
    this.storageService.get("lightTheme").then((lightTheme) => {
      if (typeof lightTheme != "boolean") {
        lightTheme = false;
        this.storageService.set("lightTheme", false);
      }
      if (this.isColorThemeLight() != lightTheme) {
        this.changeColorTheme();
      }

    });
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
