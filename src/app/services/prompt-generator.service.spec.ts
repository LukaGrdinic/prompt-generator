import { TestBed } from '@angular/core/testing';

import { PromptGeneratorService } from './prompt-generator.service';

describe('PromptGeneratorService', () => {
  let service: PromptGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromptGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
