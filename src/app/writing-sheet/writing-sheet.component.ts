import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { PromptGeneratorService } from '../services/prompt-generator.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'writing-sheet',
  templateUrl: './writing-sheet.component.html',
  styleUrl: './writing-sheet.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [PromptGeneratorService]
})
export class WritingSheetComponent {
  formGroup!: FormGroup;
  intervalId: number | null = null;
  timeLeftInSeconds = 900;
  promptCounter = 0;
  lockedContentLastIndex = 0;
  storyBeforeKeyUp = '';
  storyBeforeBackspaceKeyUp = '';
  cursorPosition = 0;
  isBackspaceHeld = false;

  @ViewChild('story') storyElementRef!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptGeneratorService,
    private cdr: ChangeDetectorRef
  ) {
    this.formGroup = this.fb.group({
      story: '',
    });
  }

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

  onClick(event: any) {
    this.cursorPosition = event.target.selectionStart;
    if (this.cursorPosition < this.lockedContentLastIndex) {
      this.setCursorPositionToEnd();
    }
  }

  onKeyDown(event: any) {
    this.captureBeforeKeyUp();
    // TODO: Make sure the user cant hold down delete or backspace key and just delete many characters
    this.cursorPosition = event.target.selectionStart;
    if (this.cursorPosition <= this.lockedContentLastIndex) {
      // if shift key is being held
      if ([17].includes(event.which)) {
        this.setCursorPositionToEnd();
      } else if (
        // if event keycode is backspace or delete
        [8, 46].includes(event.which)
      ) {
        /* TODO: Handle situation when backspace is held for a long time */
        if (!this.isBackspaceHeld) {
          this.storyBeforeBackspaceKeyUp = this.formGroup.get('story')?.value;
          this.isBackspaceHeld = true;
        }
      }
    }
  }

  captureBeforeKeyUp() {
    this.storyBeforeKeyUp = this.formGroup.get('story')?.value;
    console.log("Saved before key up happened", this.storyBeforeKeyUp);
  }

  onKeyUp(event: any) {
    console.log("Key up happened");
    this.cursorPosition = event.target.selectionStart;
    if (this.cursorPosition < this.lockedContentLastIndex) {
      // if control key is being held
      if (event.ctrlKey) {
        this.setCursorPositionToEnd();
      } else if (
        // if event keycode is backspace or delete
        [8, 46].includes(event.which)
      ) {
        this.isBackspaceHeld = false;
        this.handleDeletionWhenBackspaceHeld();
        // this.handleDeletion();
      } else if (
        // if event keycode is left, right, up, down, shift, control, home, end
        [37, 38, 39, 40, 16, 17, 36, 35].includes(event.which)
      ) {
        this.setCursorPositionToEnd();
      } else if (
        // event keycode is enter
        [13].includes(event.which)
      ) {
        // do nothing
      } else {
        this.handleCharactersAdded(this.cursorPosition);
      }
    }
  }

  setCursorPositionToEnd() {
    console.log("setting cursor position to end");
    const story = this.formGroup.get('story')?.value;
    const storyLength = story.length;
    this.storyElementRef.nativeElement.focus();
    this.storyElementRef.nativeElement.setSelectionRange(
      storyLength,
      storyLength
    );
  }

  handleDeletion() {
    this.formGroup.get('story')?.setValue(this.storyBeforeKeyUp);
    // trigger detect changes
    // this.cdr.detectChanges();
  }

  handleDeletionWhenBackspaceHeld() {
    this.formGroup.get('story')?.setValue(this.storyBeforeBackspaceKeyUp);
  }

  handleCharactersAdded(cursorPosition: number) {
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
        this.checkIfStorySentenceEnded(story)
      ) {
        this.generateNewSentence();
      }
    });
  }

  checkStoryWordCountCheckpoint(story: string) {
    return story.length > 100 * this.promptCounter;
  }

  checkIfStorySentenceEnded(story: string) {
    const punctiationMarks = ['.', '!', '?'];
    const usedPunctiationMarks = punctiationMarks.filter((mark) => story.endsWith(mark));
    return usedPunctiationMarks.length > 0;
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
