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
    this.gender = 0;
    this.correct = 0;
  }

  @Input() gender: number;
  @Input() correct: number;
  @Output() checkGender = new EventEmitter<number>();

  onClick() {
    this.checkGender.emit(this.gender);
  }
}
