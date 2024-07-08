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

  wordCount = 0;
  minWordCount = 300;
  promptCounter = 0;

  @ViewChild('story') storyElementRef!: ElementRef;
  @ViewChild('heading') headingElementRef!: ElementRef;
  @ViewChild('customTextArea') customTextAreaRef!: ElementRef;

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
    this.updateHeadingInnerText('Get Ready...');
    await wait(1000);
    this.updateHeadingInnerText('3...');
    await wait(1000);
    this.updateHeadingInnerText('2...');
    await wait(1000);
    this.updateHeadingInnerText('1...');
    await wait(1000);
    this.updateHeadingInnerText('You’re on.');
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
    this.trackCustomTextAreaChanges();
    this.generateNewSentence();
  }

  updateHeadingInnerText(innerText: string) {
    this.headingElementRef.nativeElement.innerText = innerText;
  }

  trackCustomTextAreaChanges() {
    console.log(this.customTextAreaRef.nativeElement);
    this.customTextAreaRef.nativeElement.addEventListener(
      'input',
      (event: InputEvent) => {
        const story = this.customTextAreaRef.nativeElement.innerText;
        if (
          this.checkStoryWordCountCheckpoint(story) &&
          this.checkIfStorySentenceEnded(story)
        ) {
          this.generateNewSentence();
        }
      }
    );
  }

  checkStoryWordCountCheckpoint(story: string) {
    this.wordCount = calculateWordCount(story);
    return this.wordCount > 100 * this.promptCounter;
  }

  checkIfStorySentenceEnded(story: string) {
    const punctiationMarks = ['.', '!', '?'];
    const usedPunctiationMarks = punctiationMarks.filter((mark) =>
      story.endsWith(mark)
    );
    return usedPunctiationMarks.length > 0;
  }

  createContentEditableSpan(editable: boolean) {
    const span = document.createElement('span');
    span.contentEditable = editable.toString();
    return span;
  }

  async animateSentence(span: HTMLSpanElement, sentance: string) {
    const sentanceChars = sentance.split('');
    for (let i = 0; i < sentanceChars.length; i++) {
      span.innerText += sentanceChars[i];
      await wait(50);
    }
  }

  renderNewSentence() {
    const span = this.createContentEditableSpan(false);
    this.customTextAreaRef.nativeElement.appendChild(span);
    const sentance = this.promptService.generateSchredingerSentence();
    this.animateSentence(span, sentance);
  }

  lockPreviousContent() {
    const contentSpansArray: HTMLSpanElement[] = Array.from(
      this.customTextAreaRef.nativeElement.children
    );
    contentSpansArray.forEach((span) => {
      span.contentEditable = 'false';
    });
  }

  renderMoreTextArea() {
    const editableSpan = this.createContentEditableSpan(true);
    editableSpan.innerText = '';
    this.customTextAreaRef.nativeElement.appendChild(editableSpan);
    editableSpan.focus();
  }

  async generateNewSentence() {
    this.renderNewSentence();
    this.lockPreviousContent();
    this.renderMoreTextArea();
    this.promptCounter++;
  }

  timeEnded() {
    this.isTimerVisible = false;
    this.isStoryFinished = true;
    this.displayResults();
  }
  displayResults() {
    const story = this.customTextAreaRef.nativeElement.innerText;
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
    const story = this.customTextAreaRef.nativeElement.innerText;
    navigator.clipboard.writeText(story);
    this.openSnackBar();
  }

  restartChallenge() {
    this.resetSchredingerSentenceCount();
    this.clearCustomTextArea();
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
  }

  clearCustomTextArea() {
    const children: HTMLSpanElement[] = Array.from(
      this.customTextAreaRef.nativeElement.children
    );
    children.forEach((child) => {
      child.remove();
    });
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
    <span class="text-center text-white" matSnackBarLabel
      >Copied to clipboard!</span
    >
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
