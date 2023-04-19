import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Router } from '@angular/router';

import { SettingsContentComponent } from "../settings-content/settings-content.component"

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SettingsContentComponent]
})
export class SettingsPage {

  constructor(private router: Router) { }

  returnToMain() {
    this.router.navigate([""]);
  }
}
