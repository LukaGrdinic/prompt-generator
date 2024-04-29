import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
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
import { DarkTheme, ThemeService } from '../services/theme.service';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
} from '@angular/material/snack-bar';
import { NgxDynamicHeadingsModule } from 'ngx-dynamic-headings';

/* TODO: Make the whole experince accessible */
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
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDynamicHeadingsModule,
    RouterModule,
  ],
  providers: [PromptGeneratorService],
})
export class WritingSheetComponent implements AfterViewInit {
  formGroup!: FormGroup;

  isStoryFinished = false;
  isStorySuccess = false;
  isStoryFailure = false;
  isTimerVisible = false;
  isFoldedSheetVisible = false;

  minWordCount = 300;
  promptCounter = 0;
  lockedContentLastIndex = 0;
  storyBeforeKeyUp = '';
  storyBeforeBackspaceKeyUp = '';
  cursorPosition = 0;
  isBackspaceHeld = false;

  @ViewChild('story') storyElementRef!: ElementRef;
  @ViewChild('heading') headingElementRef!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptGeneratorService,
    private themeService: ThemeService,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.fb.group({
      story: '',
    });
  }

  ngAfterViewInit() {
    this.startChallenge();
  }

  async prepareWritingEnvironment() {
    this.updateTheme();
    await this.displayHeading();
  }

  updateTheme() {
    this.themeService.updateTheme(new DarkTheme());
  }

  async displayHeading() {
    this.disableSheet();
    this.updateHeadingInnerText('Get Ready...');
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

  hideTimer() {
    this.isTimerVisible = false;
  }

  displayFoldedSheet() {
    this.isFoldedSheetVisible = true;
  }

  hideFoldedSheet() {
    this.isFoldedSheetVisible = false;
  }

  async startChallenge() {
    await this.prepareWritingEnvironment();
    this.displayTimer();
    this.displayFoldedSheet();
    this.trackStoryContentChanges();
    this.generateNewSentence(true);
  }

  updateHeadingInnerText(innerText: string) {
    this.headingElementRef.nativeElement.innerText = innerText;
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
      } else if (
        [
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
    return wordCount > 100 * this.promptCounter;
  }

  checkIfStorySentenceEnded(story: string) {
    const punctiationMarks = ['.', '!', '?'];
    const usedPunctiationMarks = punctiationMarks.filter((mark) =>
      story.endsWith(mark)
    );
    return usedPunctiationMarks.length > 0;
  }

  async generateNewSentence(isFirstSentence = false) {
    this.setCursorPositionToEnd();
    this.disableSheet();
    this.promptCounter++;
    const whiteSpaceAfterDot = ' ';
    const sentance = isFirstSentence
      ? this.promptService.generateSchredingerSentence()
      : whiteSpaceAfterDot + this.promptService.generateSchredingerSentence();
    await this.displayNewSentence(sentance);
    this.lockedContentLastIndex = this.formGroup.get('story')?.value.length;
    this.enableSheet();
    this.setCursorPositionToEnd();
  }

  async displayNewSentence(sentance: string) {
    const newSentenceChars = sentance.split('');
    for (let i = 0; i < newSentenceChars.length; i++) {
      this.formGroup
        .get('story')
        ?.setValue(this.formGroup.get('story')?.value + newSentenceChars[i]);
      await wait(50);
    }
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
    this.isStoryFinished = true;
    this.displayResults();
  }
  displayResults() {
    const story = this.formGroup.get('story')?.value;
    const wordCount = calculateWordCount(story);
    if (wordCount > this.minWordCount) {
      this.updateHeadingInnerText('Well, you actually did it.');
      this.isStorySuccess = true;
    } else {
      this.updateHeadingInnerText('Are you OK?');
      this.isStoryFailure = true;
    }
  }

  copyToClipboard() {
    const value = this.formGroup.get('story')?.value;
    navigator.clipboard.writeText(value);
    this.openSnackBar();
  }

  restartChallenge() {
    this.resetSchredingerSentenceCount();
    this.clearForm();
    this.hideTimer();
    this.hideFoldedSheet();
    this.resetVariables();
    this.startChallenge();
  }

  resetVariables() {
    this.isStoryFinished = false;
    this.isStorySuccess = false;
    this.isStoryFailure = false;
    this.isTimerVisible = false;
    this.isFoldedSheetVisible = false;
    this.minWordCount = 300;
    this.promptCounter = 0;
    this.lockedContentLastIndex = 0;
    this.storyBeforeKeyUp = '';
    this.storyBeforeBackspaceKeyUp = '';
    this.cursorPosition = 0;
    this.isBackspaceHeld = false;
  }

  clearForm() {
    this.formGroup.get('story')?.setValue('');
  }

  resetSchredingerSentenceCount() {
    this.promptService.resetSchredingerSentenceCount();
  }

  openSnackBar() {
    this.snackBar.openFromComponent(CopiedToClipboardSnackbarComponent, {
      duration: 3000,
    });
  }
}

/* TODO: Make it accessible as alert */
@Component({
  selector: 'snack-bar-annotated-component-example-snack',
  template: `
    <span class="text-center text-white" matSnackBarLabel>Copied to clipboard!</span>
  `,
  styles: `
    :host {
      display: flex;
    }
  `,
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
  ],
})
export class CopiedToClipboardSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
