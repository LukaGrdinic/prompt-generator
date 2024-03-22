import { Pipe, PipeTransform } from '@angular/core';
import { calculateWordCount } from '../utils/utils';

@Pipe({
  name: 'wordCount',
  standalone: true
})
export class WordCountPipe implements PipeTransform {

  transform(value: string): string {
    const wordCount = calculateWordCount(value);
    return wordCount.toString();
  }

}
