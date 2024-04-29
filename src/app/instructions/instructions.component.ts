import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LightTheme, ThemeService } from '../services/theme.service';
import { NgxDynamicHeadingsModule } from 'ngx-dynamic-headings';

@Component({
  selector: 'instructions',
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    NgxDynamicHeadingsModule,
    RouterModule
  ]
})
export class InstructionsComponent implements OnInit {
  
  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
      this.themeService.updateTheme(new LightTheme());
  }
}
