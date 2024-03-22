import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PromptGeneratorService } from '../services/prompt-generator.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { KeyCodes } from '../enums/KeyCodes.enum';
import { wait, calculateWordCount } from '../../utils/utils';
import { TimerComponent } from '../timer/timer.component';
import { CommonModule } from '@angular/common';
import { WordCountPipe } from '../word-count.pipe';

@Component({
  selector: 'writing-sheet',
  templateUrl: './writing-sheet.component.html',
  styleUrl: './writing-sheet.component.scss',
  standalone: true,
  imports: [
    WordCountPipe,
    TimerComponent,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [PromptGeneratorService],
})
export class WritingSheetComponent implements OnInit, AfterViewInit{
  formGroup!: FormGroup;

  isTimerVisible = false;
  minWordCount = 300;
  promptCounter = 0;
  lockedContentLastIndex = 0;
  storyBeforeKeyUp = '';
  storyBeforeBackspaceKeyUp = '';
  cursorPosition = 0;
  isBackspaceHeld = false;

  @ViewChild('story') storyElementRef!: ElementRef;
  @ViewChild('heading') headingElementRef!: ElementRef;
  @ViewChild('subheading') subheadingElementRef!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptGeneratorService,
  ) {
    this.formGroup = this.fb.group({
      story: '',
    });
  }

  ngOnInit() {
 
  }

  ngAfterViewInit() {
   this.startChallenge();
  }

  async displayHeading() {
    this.disableSheet();
    await wait(1000);
    this.updateHeadingInnerText('3...');
    await wait(1000);
    this.updateHeadingInnerText('2...');
    await wait(1000);
    this.updateHeadingInnerText('1...');
    await wait(1000);
    this.updateHeadingInnerText('You’re on.');
    this.enableSheet();
  }

  displayTimer() {
    this.isTimerVisible = true;
  }

  async startChallenge() {
    await this.displayHeading();
    this.displayTimer();
    this.trackStoryContentChanges();
    this.generateNewSentence();
  }

  updateHeadingInnerText(innerText: string) {
    this.headingElementRef.nativeElement.innerText = innerText;
  }
  updateSubheadingInnerText(innerText: string) {
    this.subheadingElementRef.nativeElement.innerText = innerText;
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
      if ([KeyCodes.Shift].includes(event.which)) {
        this.setCursorPositionToEnd();
      } else if ([KeyCodes.Backspace, KeyCodes.Delete].includes(event.which)) {
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
  }

  onKeyUp(event: any) {
    this.cursorPosition = event.target.selectionStart;
    if (this.cursorPosition < this.lockedContentLastIndex) {
      // if control key is being held
      if (event.ctrlKey) {
        this.setCursorPositionToEnd();
      } else if ([KeyCodes.Backspace, KeyCodes.Delete].includes(event.which)) {
        this.isBackspaceHeld = false;
        this.handleDeletionWhenBackspaceHeld();
      } else if ([
          KeyCodes.ArrowDown,
          KeyCodes.ArrowLeft,
          KeyCodes.ArrowRight,
          KeyCodes.ArrowUp,
          KeyCodes.Shift,
          KeyCodes.Control,
          KeyCodes.Home,
          KeyCodes.End,
        ].includes(event.which)
      ) {
        this.setCursorPositionToEnd();
      } else if (
        // event keycode is enter
        [KeyCodes.Enter].includes(event.which)
      ) {
        // do nothing
      } else {
        this.handleCharactersAdded(this.cursorPosition);
      }
    }
  }

  setCursorPositionToEnd() {
    const story = this.formGroup.get('story')?.value;
    const storyLength = story.length;
    this.storyElementRef.nativeElement.focus();
    this.storyElementRef.nativeElement.setSelectionRange(
      storyLength,
      storyLength
    );
  }

  handleDeletionWhenBackspaceHeld() {
    this.formGroup.get('story')?.setValue(this.storyBeforeBackspaceKeyUp);
  }

  handleCharactersAdded(cursorPosition: number) {
    // delete the caracter at the cursorPosition and set the cursor position to the end of the locked content
    const story: string = this.formGroup.get('story')?.value;
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
    const wordCount = calculateWordCount(story);
    return wordCount > 100  * this.promptCounter;
  }

  checkIfStorySentenceEnded(story: string) {
    const punctiationMarks = ['.', '!', '?'];
    const usedPunctiationMarks = punctiationMarks.filter((mark) =>
      story.endsWith(mark)
    );
    return usedPunctiationMarks.length > 0;
  }

  generateNewSentence() {
    this.disableSheet();
    this.promptCounter++;
    const sentance = this.promptService.generateSentence();
    const story = this.formGroup.get('story')?.value;
    this.formGroup.get('story')?.setValue(story + sentance);
    this.lockedContentLastIndex = this.formGroup.get('story')?.value.length;
    this.enableSheet();
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }

  disableSheet() {
    this.formGroup.get('story')?.disable({ emitEvent: false });
  }

  enableSheet() {
    this.formGroup.get('story')?.enable({ emitEvent: false });
  }

  timeEnded() {
    this.disableSheet();
    this.isTimerVisible = false;
    this.displayResults();
  }
  displayResults() {
    const story = this.formGroup.get('story')?.value;
    const wordCount = calculateWordCount(story);
    if (wordCount > this.minWordCount) {
      this.updateHeadingInnerText('Well, you actually did it.');
      this.updateSubheadingInnerText('Bravo! Copy your story and continue working on it—or store it at the bottom of the cringe pile, you be the judge of that.')
    } else {
      this.updateHeadingInnerText('Are you OK?');
      this.updateSubheadingInnerText('Well, time is up and you don’t seem to have successfully completed the task. In case we didn’t bore you to death, why not try again?')
    }
  }
}
