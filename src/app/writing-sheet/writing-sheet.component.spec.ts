import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingSheetComponent } from './writing-sheet.component';

describe('WritingSheetComponent', () => {
  let component: WritingSheetComponent;
  let fixture: ComponentFixture<WritingSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WritingSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
