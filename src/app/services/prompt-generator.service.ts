import { Injectable } from '@angular/core';

@Injectable()
export class PromptGeneratorService {

  constructor() { }

  generateSentence(): string {
    return 'There was a funny looking cat at the alley, wearing a hat and a bowtie.';
  }
}
