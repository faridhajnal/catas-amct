import { Tequila } from './../models/tequila.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortName'
})
export class SortNamePipe implements PipeTransform {

  transform(value: Tequila[]): Tequila[] {
      value.sort((a: Tequila, b: Tequila) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
      });
      return value;
      }
}
