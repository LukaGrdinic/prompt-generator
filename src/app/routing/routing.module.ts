import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstructionsComponent } from '../instructions/instructions.component';
import { WritingSheetComponent } from '../writing-sheet/writing-sheet.component';

export const routes: Routes = [
    {path: '', redirectTo: 'schroedinger-challenge-instructions' , pathMatch: 'full'},
    {path: 'schroedinger-challenge-instructions', component: InstructionsComponent},
    {path: 'schroedinger-challenge-writing', component: WritingSheetComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }