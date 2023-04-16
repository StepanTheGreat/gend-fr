import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings-content',
  templateUrl: './settings-content.component.html',
  styleUrls: ['./settings-content.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SettingsContentComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
