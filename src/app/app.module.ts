import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InstructionsComponent } from './instructions/instructions.component';
import { WritingSheetComponent } from './writing-sheet/writing-sheet.component';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './routing/routing.module';

@NgModule({
  declarations: [AppComponent, InstructionsComponent, WritingSheetComponent],
  imports: [BrowserModule, MatToolbarModule, MatButtonModule, AppRoutingModule],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
