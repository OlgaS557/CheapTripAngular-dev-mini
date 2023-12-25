import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'capitalFirstLetter'})

export class CapitalFirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    return value[0].toUpperCase() + value.substr(1).toLowerCase();
  }
}
