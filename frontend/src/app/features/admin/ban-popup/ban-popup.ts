import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';

@Component({
  selector: 'app-ban-popup',
  imports: [Materaile],
  templateUrl: './ban-popup.html',
  styleUrl: './ban-popup.scss',
})
export class BanPopup {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();
  @Input() delete: boolean = false;
  @Input() unban: boolean = false;
  @Input() ban: boolean = false;
  step: number = 1;
  banDays: number = 7;
  quickOptions: number[] = [1, 7, 14, 30, 90];

  nextStep() {
    this.step = 2;
  }

  previousStep() {
    this.step = 1;
  }

  closePopup() {
    this.step = 1;
    this.banDays = 7;
    this.close.emit();
  }

  confirmBan() {
    this.confirm.emit(this.banDays);
    this.closePopup();
  }

  onOverlayClick(event: MouseEvent) {
    this.closePopup();
  }
}
