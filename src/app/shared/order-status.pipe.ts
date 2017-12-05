import { CataUser } from '../models/cata_user.model';
import { Tequila } from './../models/tequila.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByStatus'
})
export class SortStatusPipe implements PipeTransform {

  transform(value: CataUser[]): CataUser[] {
      value.sort((a: CataUser, b: CataUser) => {
          if (a.status < b.status) {
            return -1;
          } else if (a.status > b.status) {
            return 1;
          } else {
            return 0;
          }
      });
      return value;
      }
}
