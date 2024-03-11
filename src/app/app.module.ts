import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InstructionsComponent } from './instructions/instructions.component';
import { WritingSheetComponent } from './writing-sheet/writing-sheet.component';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './routing/routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PromptGeneratorService } from './services/prompt-generator.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, InstructionsComponent, WritingSheetComponent],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [provideAnimationsAsync(), PromptGeneratorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
