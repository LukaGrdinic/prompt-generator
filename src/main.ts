import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Routes, provideRouter } from '@angular/router';
import { InstructionsComponent } from './app/instructions/instructions.component';
import { WritingSheetComponent } from './app/writing-sheet/writing-sheet.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const routes: Routes = [
    {path: '', redirectTo: 'schroedinger-challenge-instructions' , pathMatch: 'full'},
    {path: 'schroedinger-challenge-instructions', component: InstructionsComponent},
    {path: 'schroedinger-challenge-writing', component: WritingSheetComponent},
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync()
    ],
});
