import { Component } from '@angular/core';
import { PromptGeneratorService } from '../services/prompt-generator.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'writing-sheet',
  templateUrl: './writing-sheet.component.html',
  styleUrl: './writing-sheet.component.scss',
})
export class WritingSheetComponent {
  formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptGeneratorService
  ) {
    this.formGroup = this.fb.group({
      story: '',
    });
  }

  intervalId: number | null = null;
  timeLeftInSeconds = 900;
  promptCounter = 0;
  lockedContentLastIndex = 0;
  storyBeforeKeyUp = '';

  ngOnInit() {
    this.startTimer();
    this.trackStoryContentChanges();
    this.generateNewSentence();
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timeLeftInSeconds -= 1;
      if (this.timeLeftInSeconds % 180 === 0) {
        this.notifyUserThreeMinutesHavePassed();
      }
      if (this.timeLeftInSeconds === 0) {
        this.stopTimer();
      }
    }, 1000) as unknown as number;
  }

  notifyUserThreeMinutesHavePassed() {
    console.log('Three minutes have passed!');
  }

  captureBeforeKeyUp() {
    this.storyBeforeKeyUp =  this.formGroup.get('story')?.value;
  }

  onKeyUp(event: any) {
    const cursorPosition = event.target.selectionStart;
    if (cursorPosition < this.lockedContentLastIndex) {
      console.log('event', event);
      // if event keycode is backspace
      if (event.which === 8) {
        this.handleBackspace(cursorPosition);
      } else if (
        // if event keycode is left right up down
        [37, 38, 39, 40].includes(event.which)
      ) {
        // do nothing
      } else {
        this.handleCharactersEntered(cursorPosition);
      }
    }
  }

  handleBackspace(cursorPosition: number) {
    this.formGroup.get('story')?.setValue(this.storyBeforeKeyUp);
  }

  handleCharactersEntered(cursorPosition: number) {
    // delete the caracter at the cursorPosition and set the cursor position to the end of the locked content
    const story: string = this.formGroup.get('story')?.value;
    console.log('story', story);
    // trigger undo action
    const storyBeforeCursor = story.slice(0, cursorPosition);
    const storyAfterCursor = story.slice(cursorPosition);
    const storyBeforeCursorWithoutLastChar = storyBeforeCursor.slice(0, -1);
    const newStory = storyBeforeCursorWithoutLastChar + storyAfterCursor;
    this.formGroup.get('story')?.setValue(newStory);
  }

  trackStoryContentChanges() {
    this.formGroup.get('story')?.valueChanges.subscribe((story) => {
      if (
        this.checkStoryWordCountCheckpoint(story) &&
        this.checkStorySentenceEnded(story)
      ) {
        this.generateNewSentence();
      }
    });
  }

  checkStoryWordCountCheckpoint(story: string) {
    return story.length > 100 * this.promptCounter;
  }

  checkStorySentenceEnded(story: string) {
    return story.endsWith('.');
  }

  generateNewSentence() {
    this.promptCounter++;
    const sentance = this.promptService.generateSentence();
    const story = this.formGroup.get('story')?.value;
    this.formGroup.get('story')?.setValue(story + sentance);
    this.lockedContentLastIndex = this.formGroup.get('story')?.value.length;
  }

  stopTimer() {
    clearInterval(this.intervalId as number);
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }
}
