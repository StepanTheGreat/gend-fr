import { Component, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-gender-btn',
  templateUrl: './gender-btn.component.html',
  styleUrls: ['./gender-btn.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})

export class GenderBtnComponent  {
  constructor() {
    this.btnIndex = 0;
    this.btnTheme = 0;
  }

  @Input() btnIndex: number;
  @Input() btnTheme: number;
  @Output() checkGender = new EventEmitter<number>();

  onClick() {
    this.checkGender.emit(this.btnIndex);
  }
}
