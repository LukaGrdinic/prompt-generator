import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDigits',
  standalone: true
})
export class TwoDigitsPipe implements PipeTransform {

  transform(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

}