import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'instructions',
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterModule
  ]
})
export class InstructionsComponent {

}
