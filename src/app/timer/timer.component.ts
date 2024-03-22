import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TwoDigitsPipe } from '../two-digits.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'timer',
  standalone: true,
  imports: [
    CommonModule,
    TwoDigitsPipe
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit {
  private intervalId: number | null = null;
  @Input({ required: true }) seconds!: number;
  @Output() timeEnded = new EventEmitter<void>();

  isTimerInWarningZone = false;
  isTimerInDangerZone = false;

  ngOnInit() {
    this.initializeTimer();
  }

  get timeLeftInMinutes() {
    return Math.floor(this.seconds / 60);
  }
  get timeLeftInSeconds() {
    return this.seconds % 60;
  }

  initializeTimer() {
    this.intervalId = setInterval(() => {
      this.seconds -= 1;
      if (this.seconds < 30) {
        this.isTimerInWarningZone = false;
        this.isTimerInDangerZone = true;
        return;
      }
      if (this.seconds < 60) {
        this.isTimerInWarningZone = true;
        return;
      }
      if (this.seconds === 0) {
        this.stopTimer();
      }
    }, 1000) as unknown as number;
  }

  stopTimer() {
    clearInterval(this.intervalId as number);
    this.timeEnded.emit();
  }
}
